/** API endpoints used by the API tests. */
const API_ENDPOINTS = {
  login: '/rest/user/login',
  users: '/api/Users',
  basketItems: '/api/BasketItems',
  search: (query) => `/rest/products/search?q=${encodeURIComponent(query)}`,
  basket: (basketId) => `/rest/basket/${basketId}`,
  basketItem: (itemId) => `/api/BasketItems/${itemId}`,
};

/** HTTP methods used by the API client. */
const HTTP_METHOD = { get: 'GET', post: 'POST', delete: 'DELETE' };

/** HTTP status codes used in API checks. */
const API_STATUS = { ok: 200, created: 201, unauthorized: 401 };

/** HTTP header names and values. */
const HEADERS = {
  contentType: 'Content-Type',
  json: 'application/json',
  authorization: 'Authorization',
  bearerPrefix: 'Bearer ',
};

/** Kinds of email used by the data-driven login test. */
const EMAIL_KIND = { registered: 'registered', unknown: 'unknown', empty: 'empty' };

/** Basket scenario data. */
const BASKET_ITEM = {
  nonExistingProductId: 999999,
  quantityOne: 1,
  negativeQuantity: -1,
};

/** Name of the report annotation that marks a defect or a suspicious behaviour. */
const FINDING_ANNOTATION = 'finding';

/** Field of the token payload that must not contain the password. */
const PASSWORD_FIELD = 'password';

/** ReqRes service used for the pagination checks. */
const REQRES = {
  baseUrl: process.env.REQRES_BASE_URL || 'https://reqres.in',
  usersPage: (page) => `/api/users?page=${page}`,
  firstPage: 1,
};

/**
 * Statuses observed on the local Docker stand (see notes.md).
 * Some of them document defects, so they are recorded as findings in the report.
 */
const OBSERVED_STATUS = {
  emptyEmailLogin: 401,
  emptyPasswordLogin: 401,
  foreignBasket: 200,
  nonExistingProduct: 500,
  negativeQuantity: 200,
  emptySearch: 200,
};

module.exports = {
  API_ENDPOINTS,
  HTTP_METHOD,
  API_STATUS,
  HEADERS,
  EMAIL_KIND,
  BASKET_ITEM,
  FINDING_ANNOTATION,
  PASSWORD_FIELD,
  REQRES,
  OBSERVED_STATUS,
};
