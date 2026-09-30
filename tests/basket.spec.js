const { test } = require('@playwright/test');
const { EXPECTED, PRODUCT_NAME } = require('../config/constants');
const { addProductToBasket, openBasket, removeProductFromBasket } = require('../src/utils/basket');
const { startLoggedInSession } = require('../src/utils/session');
const {
  expectBasketEmpty,
  expectProductAdded,
  expectProductAddedAgain,
  expectProductInBasket,
  expectTotalPrice,
} = require('../src/utils/asserts');

test.beforeEach(async ({ page, request }) => {
  await startLoggedInSession(page, request);
});

test('should add product to basket and show it in basket', async ({ page }) => {
  await addProductToBasket(page, PRODUCT_NAME);
  await expectProductAdded(page, PRODUCT_NAME);
  await openBasket(page);
  await expectProductInBasket(page, PRODUCT_NAME);
  await expectTotalPrice(page, EXPECTED.priceOne);
});

test('should show empty basket for a new user', async ({ page }) => {
  await openBasket(page);
  await expectBasketEmpty(page);
});

test('should increase quantity when adding the same product twice', async ({ page }) => {
  await addProductToBasket(page, PRODUCT_NAME);
  await expectProductAdded(page, PRODUCT_NAME);
  await addProductToBasket(page, PRODUCT_NAME);
  await expectProductAddedAgain(page, PRODUCT_NAME);
  await openBasket(page);
  await expectTotalPrice(page, EXPECTED.priceTwo);
});

test('should remove product from basket', async ({ page }) => {
  await addProductToBasket(page, PRODUCT_NAME);
  await expectProductAdded(page, PRODUCT_NAME);
  await openBasket(page);
  await removeProductFromBasket(page, PRODUCT_NAME);
  await expectBasketEmpty(page);
});
