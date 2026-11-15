const { test } = require('@playwright/test');
const { EXPECTED, PRODUCT_NAME, ROUTES } = require('../config/constants');
const { acceptCookies, dismissWelcomeBanner } = require('../src/utils/auth');
const { addProductToBasket, openBasket, removeProductFromBasket } = require('../src/utils/basket');
const { loginAsNewUser } = require('../src/utils/session');
const {
  expectBasketOpen,
  expectCheckoutEnabled,
  expectProductAbsentFromBasket,
  expectProductAdded,
  expectProductAddedAgain,
  expectProductInBasket,
  expectTotalPrice,
} = require('../src/utils/asserts');

test.beforeEach(async ({ page, request }) => {
  await page.goto(ROUTES.home);
  await dismissWelcomeBanner(page);
  await acceptCookies(page);
  await loginAsNewUser(page, request);
});

test('should show added product and total price in basket', async ({ page }) => {
  await addProductToBasket(page, PRODUCT_NAME);
  await expectProductAdded(page, PRODUCT_NAME);
  await openBasket(page);
  await expectProductInBasket(page, PRODUCT_NAME);
  await expectCheckoutEnabled(page);
  await expectTotalPrice(page, EXPECTED.priceOne);
});

test('should show no products in basket for a new user', async ({ page }) => {
  await openBasket(page);
  await expectBasketOpen(page);
  await expectProductAbsentFromBasket(page, PRODUCT_NAME);
});

test('should double the total price when the same product is added twice', async ({ page }) => {
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
  await expectProductAbsentFromBasket(page, PRODUCT_NAME);
});
