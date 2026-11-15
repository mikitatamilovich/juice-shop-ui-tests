# API notes: OWASP Juice Shop

Stand: local Docker (`bkimminich/juice-shop`), `http://localhost:3000`.
Flow explored in the browser (DevTools, Network): register, login, search, add to basket, open basket.

## 1. Register

`POST /api/Users/` -> **201**

Request: `{ "email", "password", "passwordRepeat", "securityQuestion": {...}, "securityAnswer" }`

Response: `{ "status": "success", "data": { "id": 25, "email", "role": "customer", "isActive": true, ... } }` (no password in the response)

## 2. Login

`POST /rest/user/login` -> **200**

Request: `{ "email": "...", "password": "..." }`

Response:

```json
{ "authentication": { "token": "<JWT>", "bid": 6, "umail": "recon.ui@example.com" } }
```

JWT payload (decoded): `{ "data": { "id": 25, "email": "...", "password": "<hash>", "role": "customer", ... }, "bid": 6, "iat": ... }`

- `bid` (basket id) is available both in the response body and in the token payload.
- Finding: the token payload contains the user's password hash.

## 3. Search

`GET /rest/products/search?q=` -> **200**

Response: `{ "status": "success", "data": [ { "id", "name", "description", "price", "deluxePrice", "image", "createdAt", "updatedAt", "deletedAt" }, ... ] }`

- Empty `q` returns the whole catalogue (46 products), not an error.
- Apple Juice (1000ml) has `id: 1`, price 1.99.
- Matching is a substring match, so `q=Apple` also finds "Pineapple Juice (1000ml)".

## 4. Add to basket

`POST /api/BasketItems/` -> **200**

Request (sent by the UI): `{ "ProductId": 1, "BasketId": "6", "quantity": 1 }`

Response: `{ "status": "success", "data": { "id": 9, "ProductId": 1, "BasketId": "6", "quantity": 1, "createdAt", "updatedAt" } }`

- Observation: the UI sends `BasketId` as a string and the response returns it as a string, while `GET /rest/basket/:id` returns it as a number.

## 5. Get basket

`GET /rest/basket/6` -> **200**

Empty basket: `{ "status": "success", "data": { "id": 6, "coupon": null, "UserId": 25, "Products": [] } }`

After adding a product, `Products` contains the product with a nested `BasketItem`:
`{ "id": 1, "name": "Apple Juice (1000ml)", "price": 1.99, ..., "BasketItem": { "ProductId": 1, "BasketId": 6, "id": 9, "quantity": 1 } }`

- `BasketItem.id` (9) is the id used to delete the item.

## 6. Probes from REST Client (docs/api-recon.http)

| #   | Request                                  | Actual status | Body (short)                                            |
| --- | ---------------------------------------- | ------------- | ------------------------------------------------------- |
| 05  | Login, wrong password                    | 401           | text "Invalid email or password."                       |
| 06  | Login, non-existing email                | 401           | text "Invalid email or password"                        |
| 07  | Login, empty email                       | 401           | text "Invalid email or password."                       |
| 08  | Login, empty password                    | 401           | text "Invalid email or password."                       |
| 09  | Basket without token                     | 401           | HTML: "No Authorization header was found"               |
| 10  | Own basket with own token                | 200           | basket JSON, `Products: []`                             |
| 11  | Foreign basket with own token            | 200           | basket of the other user (`UserId` differs)             |
| 12  | Search `q=Apple`                         | 200           | 3 products (Apple Juice, Apple Pomace, Pineapple Juice) |
| 13  | Search, no matches                       | 200           | `{ "status": "success", "data": [] }`                   |
| 14  | Search, empty `q`                        | 200           | whole catalogue (46 products)                           |
| 15  | Add item without token                   | 401           | HTML: "No Authorization header was found"               |
| 16  | Add item, ProductId 999999               | 500           | HTML: "Error: No such product found!" with stack trace  |
| 17  | Add item, quantity -1                    | 200           | item created with `quantity: -1`                        |
| 19  | Add item after request 17 (same product) | 500           | HTML error page, SQLite error in the stack trace        |
| 21  | Delete basket item                       | 200           | `{ "status": "success", "data": {} }`                   |
| 22  | Basket after delete                      | 200           | `Products: []`                                          |
| 23  | ReqRes page 1                            | 200           | `total: 12`, `total_pages: 2`, 6 items                  |
| 24  | ReqRes page 2                            | 200           | 6 items                                                 |

## 7. Findings

1. **Broken access control (request 11).** A user can read another user's basket by id with their own token (200 and full data).
2. **Negative quantity accepted (request 17).** `quantity: -1` returns 200 and the item is stored, the basket then contains an item with a negative quantity.
3. **500 instead of 4xx for a non-existing product (request 16).** The HTML error page also exposes an internal file path and a stack trace.
4. **500 on a repeated add (request 19).** Adding a product that is already in the basket as a new item returns 500 with a database error (probably a uniqueness constraint). Needs a separate check to confirm the cause.
5. **Password hash in the JWT payload.** `data.password` is present in the decoded token.
6. **Errors are not JSON.** Login failures and server errors return `text/html` bodies, not a JSON error object.
7. **Inconsistent types.** `BasketId` is returned as a string when the client sends a string, and as a number in `GET /rest/basket/:id`. Date formats also differ between endpoints (`2026-10-13 19:39:15.953 +00:00` in search, ISO in basket).
