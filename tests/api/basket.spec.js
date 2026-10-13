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
const { recordFinding } = require('../../src/utils/findings');
const { API_STATUS, BASKET_ITEM, OBSERVED_STATUS } = require('../../config/api.constants');
const { PRODUCT_NAME } = require('../../config/constants');

test.afterEach(async ({ account, basketCleanup }) => {
  for (const itemId of basketCleanup.filter(Boolean)) {
    await deleteBasketItem(account.token, itemId);
  }
});

test('should return 401 for basket request without token', async ({ account }) => {
  const response = await getBasket(undefined, account.basketId);
  expect(response.status).toBe(API_STATUS.unauthorized);
});

test('should return own basket for request with own token', async ({ account }) => {
  const response = await getBasket(account.token, account.basketId);
  expect(response.status).toBe(API_STATUS.ok);
  expect(validateBasket(response.body), formatSchemaErrors(validateBasket)).toBe(true);
  expect(response.body.data.id).toBe(account.basketId);
});

test('should record behaviour for foreign basket requested with own token', async ({
  account,
  otherAccount,
}) => {
  const response = await getBasket(account.token, otherAccount.basketId);
  recordFinding(`Foreign basket requested with own token: status ${response.status}`);
  expect(response.status).toBe(OBSERVED_STATUS.foreignBasket);
  expect(response.body.data.id).toBe(otherAccount.basketId);
});

test('should return created basket item with valid field types', async ({
  account,
  basketCleanup,
}) => {
  const productId = await findProductIdByName(PRODUCT_NAME);
  const added = await addToBasket(
    account.token,
    buildBasketItem(account.basketId, productId, BASKET_ITEM.quantityOne),
  );
  basketCleanup.push(added.body.data?.id);
  expect(added.status).toBe(API_STATUS.ok);
  expect(validateBasketItem(added.body.data), formatSchemaErrors(validateBasketItem)).toBe(true);
  expect(added.body.data.quantity).toBe(BASKET_ITEM.quantityOne);
});

test('should increase basket item count by exactly one', async ({ account, basketCleanup }) => {
  const productId = await findProductIdByName(PRODUCT_NAME);
  const before = await getBasket(account.token, account.basketId);
  const added = await addToBasket(
    account.token,
    buildBasketItem(account.basketId, productId, BASKET_ITEM.quantityOne),
  );
  basketCleanup.push(added.body.data?.id);
  const after = await getBasket(account.token, account.basketId);
  expect(after.body.data.Products.length, 'Basket must grow by exactly one item').toBe(
    before.body.data.Products.length + 1,
  );
  const item = after.body.data.Products.find((product) => product.id === productId);
  expect(item.BasketItem.quantity).toBe(BASKET_ITEM.quantityOne);
});

test('should handle non-existing product id', async ({ account, basketCleanup }) => {
  const response = await addToBasket(
    account.token,
    buildBasketItem(account.basketId, BASKET_ITEM.nonExistingProductId, BASKET_ITEM.quantityOne),
  );
  basketCleanup.push(response.body?.data?.id);
  recordFinding(`Non-existing ProductId: status ${response.status}`);
  expect(response.status).toBe(OBSERVED_STATUS.nonExistingProduct);
});

test('should handle negative quantity', async ({ account, basketCleanup }) => {
  const productId = await findProductIdByName(PRODUCT_NAME);
  const response = await addToBasket(
    account.token,
    buildBasketItem(account.basketId, productId, BASKET_ITEM.negativeQuantity),
  );
  basketCleanup.push(response.body?.data?.id);
  recordFinding(`Negative quantity: status ${response.status}`);
  expect(response.status).toBe(OBSERVED_STATUS.negativeQuantity);
});

test('should return 401 for adding product without token', async ({ account }) => {
  const productId = await findProductIdByName(PRODUCT_NAME);
  const response = await addToBasket(
    undefined,
    buildBasketItem(account.basketId, productId, BASKET_ITEM.quantityOne),
  );
  expect(response.status).toBe(API_STATUS.unauthorized);
});

test('should remove product from basket', async ({ account }) => {
  const productId = await findProductIdByName(PRODUCT_NAME);
  const before = await getBasket(account.token, account.basketId);
  const added = await addToBasket(
    account.token,
    buildBasketItem(account.basketId, productId, BASKET_ITEM.quantityOne),
  );
  const removed = await deleteBasketItem(account.token, added.body.data.id);
  expect(removed.status).toBe(API_STATUS.ok);
  const after = await getBasket(account.token, account.basketId);
  expect(after.body.data.Products.length).toBe(before.body.data.Products.length);
});
