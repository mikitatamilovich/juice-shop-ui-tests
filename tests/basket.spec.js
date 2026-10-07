const { authenticatedTest: test } = require('../src/fixtures');
const { EXPECTED, PRODUCT_NAME } = require('../config/constants');

test('should show added product and total price in basket', async ({
  productsPage,
  basketPage,
}) => {
  await productsPage.addToBasket(PRODUCT_NAME);
  await productsPage.expectProductAdded(PRODUCT_NAME);
  await basketPage.openBasket();
  await basketPage.expectProductInBasket(PRODUCT_NAME);
  await basketPage.expectCheckoutEnabled();
  await basketPage.expectTotalPrice(EXPECTED.priceOne);
});

test('should show no products in basket for a new user', async ({ basketPage }) => {
  await basketPage.openBasket();
  await basketPage.expectOpen();
  await basketPage.expectProductAbsent(PRODUCT_NAME);
});

test('should double the total price when the same product is added twice', async ({
  productsPage,
  basketPage,
}) => {
  await productsPage.addToBasket(PRODUCT_NAME);
  await productsPage.expectProductAdded(PRODUCT_NAME);
  await productsPage.addToBasket(PRODUCT_NAME);
  await productsPage.expectProductAddedAgain(PRODUCT_NAME);
  await basketPage.openBasket();
  await basketPage.expectTotalPrice(EXPECTED.priceTwo);
});

test('should remove product from basket', async ({ productsPage, basketPage }) => {
  await productsPage.addToBasket(PRODUCT_NAME);
  await productsPage.expectProductAdded(PRODUCT_NAME);
  await basketPage.openBasket();
  await basketPage.removeProduct(PRODUCT_NAME);
  await basketPage.expectProductAbsent(PRODUCT_NAME);
});
