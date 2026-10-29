const { test } = require('../src/fixtures');
const { PRODUCT_NAME, SEARCH } = require('../config/constants');

test.beforeEach(async ({ basePage }) => {
  await basePage.open();
  await basePage.dismissWelcomeBanner();
  await basePage.acceptCookies();
});

test('should show product cards with Add to Basket button on the main page', async ({
  productsPage,
}) => {
  await productsPage.expectFirstCardVisible();
  await productsPage.expectFirstCardHasAddButton();
});

test('should show matching product for existing search query', async ({ productsPage }) => {
  await productsPage.search(SEARCH.existingQuery);
  await productsPage.expectProductShown(PRODUCT_NAME);
});

test('should show no results message for missing search query', async ({ productsPage }) => {
  await productsPage.search(SEARCH.missingQuery);
  await productsPage.expectNoResults();
});
