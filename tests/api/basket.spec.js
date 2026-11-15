const { expect } = require('@playwright/test');
const { test } = require('../../src/fixtures/api');
const {
  addToBasket,
  buildBasketItem,
  deleteBasketItem,
  getBasket,
} = require('../../src/api/basket');
const { findProductIdByName } = require('../../src/api/products');
const { formatSchemaErrors, validateBasket, validateBasketItem } = require('../../src/schemas');
const { API_STATUS, BASKET_ITEM } = require('../../config/api.constants');
const { MESSAGES, PRODUCT_NAME } = require('../../config/constants');

/**
 * Adds the product to the account basket and registers the new item for cleanup.
 * @param {import('@playwright/test').APIRequestContext} request - Playwright request context.
 * @param {{token: string, basketId: number}} account - Account that owns the basket.
 * @param {number} productId - Product id.
 * @param {number} quantity - Quantity to add.
 * @param {Array<number|undefined>} basketCleanup - Item ids to delete after the test.
 * @returns {Promise<{status: number, body: any}>} Raw response.
 */
async function addAndTrack(request, account, productId, quantity, basketCleanup) {
  const response = await addToBasket(
    request,
    account.token,
    buildBasketItem(account.basketId, productId, quantity),
  );
  basketCleanup.push(response.body?.data?.id);
  return response;
}

test('should return 401 for basket request without token', async ({ request, account }) => {
  const response = await getBasket(request, undefined, account.basketId);
  expect(response.status).toBe(API_STATUS.unauthorized);
  expect(response.body).toContain(MESSAGES.noAuthHeader);
});

test('should return own basket for request with own token', async ({ request, account }) => {
  const response = await getBasket(request, account.token, account.basketId);
  expect(response.status).toBe(API_STATUS.ok);
  expect(validateBasket(response.body), formatSchemaErrors(validateBasket)).toBe(true);
  expect(response.body.data.id).toBe(account.basketId);
});

test('should return 403 for foreign basket requested with own token', async ({
  request,
  account,
  otherAccount,
}) => {
  const response = await getBasket(request, account.token, otherAccount.basketId);
  expect(response.status, 'A user must not read the basket of another user').toBe(
    API_STATUS.forbidden,
  );
});

test('should return created basket item with valid field types', async ({
  request,
  account,
  basketCleanup,
}) => {
  const productId = await findProductIdByName(request, PRODUCT_NAME);
  const added = await addAndTrack(
    request,
    account,
    productId,
    BASKET_ITEM.quantityOne,
    basketCleanup,
  );
  expect(added.status).toBe(API_STATUS.ok);
  expect(validateBasketItem(added.body.data), formatSchemaErrors(validateBasketItem)).toBe(true);
  expect(added.body.data.quantity).toBe(BASKET_ITEM.quantityOne);
});

test('should increase basket item count by exactly one', async ({
  request,
  account,
  basketCleanup,
}) => {
  const productId = await findProductIdByName(request, PRODUCT_NAME);
  const before = await getBasket(request, account.token, account.basketId);
  await addAndTrack(request, account, productId, BASKET_ITEM.quantityOne, basketCleanup);
  const after = await getBasket(request, account.token, account.basketId);
  expect(after.body.data.Products.length, 'Basket must grow by exactly one item').toBe(
    before.body.data.Products.length + 1,
  );
  const item = after.body.data.Products.find((product) => product.id === productId);
  expect(item.BasketItem.quantity).toBe(BASKET_ITEM.quantityOne);
});

test('should return 400 for non-existing product id', async ({
  request,
  account,
  basketCleanup,
}) => {
  const response = await addAndTrack(
    request,
    account,
    BASKET_ITEM.nonExistingProductId,
    BASKET_ITEM.quantityOne,
    basketCleanup,
  );
  expect(response.status, 'A client error is expected, not a server error').toBe(
    API_STATUS.badRequest,
  );
});

test('should return 400 for negative quantity', async ({ request, account, basketCleanup }) => {
  const productId = await findProductIdByName(request, PRODUCT_NAME);
  const response = await addAndTrack(
    request,
    account,
    productId,
    BASKET_ITEM.negativeQuantity,
    basketCleanup,
  );
  expect(response.status, 'Negative quantity must be rejected').toBe(API_STATUS.badRequest);
});

test('should return 400 for zero quantity', async ({ request, account, basketCleanup }) => {
  const productId = await findProductIdByName(request, PRODUCT_NAME);
  const response = await addAndTrack(
    request,
    account,
    productId,
    BASKET_ITEM.zeroQuantity,
    basketCleanup,
  );
  expect(response.status, 'Zero quantity must be rejected').toBe(API_STATUS.badRequest);
});

test('should return 401 for adding product without token', async ({ request, account }) => {
  const productId = await findProductIdByName(request, PRODUCT_NAME);
  const response = await addToBasket(
    request,
    undefined,
    buildBasketItem(account.basketId, productId, BASKET_ITEM.quantityOne),
  );
  expect(response.status).toBe(API_STATUS.unauthorized);
  expect(response.body).toContain(MESSAGES.noAuthHeader);
  const basket = await getBasket(request, account.token, account.basketId);
  expect(basket.body.data.Products).toHaveLength(0);
});

test('should return 401 for adding product to foreign basket', async ({
  request,
  account,
  otherAccount,
}) => {
  const productId = await findProductIdByName(request, PRODUCT_NAME);
  const response = await addToBasket(
    request,
    account.token,
    buildBasketItem(otherAccount.basketId, productId, BASKET_ITEM.quantityOne),
  );
  try {
    expect(response.status, 'A user must not change the basket of another user').toBe(
      API_STATUS.unauthorized,
    );
    const basket = await getBasket(request, otherAccount.token, otherAccount.basketId);
    expect(basket.body.data.Products).toHaveLength(0);
  } finally {
    await deleteBasketItem(request, otherAccount.token, response.body?.data?.id);
  }
});

test('should remove product from basket', async ({ request, account, basketCleanup }) => {
  const productId = await findProductIdByName(request, PRODUCT_NAME);
  const before = await getBasket(request, account.token, account.basketId);
  const added = await addAndTrack(
    request,
    account,
    productId,
    BASKET_ITEM.quantityOne,
    basketCleanup,
  );
  const removed = await deleteBasketItem(request, account.token, added.body.data.id);
  expect(removed.status).toBe(API_STATUS.ok);
  expect(removed.body).toEqual({ status: 'success', data: {} });
  const after = await getBasket(request, account.token, account.basketId);
  expect(after.body.data.Products.length).toBe(before.body.data.Products.length);
});

test('should return 401 for deleting basket item without token', async ({
  request,
  account,
  basketCleanup,
}) => {
  const productId = await findProductIdByName(request, PRODUCT_NAME);
  const added = await addAndTrack(
    request,
    account,
    productId,
    BASKET_ITEM.quantityOne,
    basketCleanup,
  );
  const response = await deleteBasketItem(request, undefined, added.body.data.id);
  expect(response.status).toBe(API_STATUS.unauthorized);
  expect(response.body).toContain(MESSAGES.noAuthHeader);
  const basket = await getBasket(request, account.token, account.basketId);
  expect(basket.body.data.Products).toHaveLength(1);
});

test('should return 404 for deleting non-existing basket item', async ({ request, account }) => {
  const response = await deleteBasketItem(request, account.token, BASKET_ITEM.nonExistingItemId);
  expect(response.status).toBe(API_STATUS.notFound);
});
