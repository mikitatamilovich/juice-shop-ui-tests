const { test } = require('@playwright/test');
const { PRODUCT_NAME, ROUTES, SEARCH } = require('../config/constants');
const { acceptCookies, dismissWelcomeBanner } = require('../src/utils/auth');
const { searchProduct } = require('../src/utils/search');
const {
  expectFirstCardHasAddButton,
  expectFirstCardVisible,
  expectNoSearchResults,
  expectProductCardShown,
} = require('../src/utils/asserts');

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.home);
  await dismissWelcomeBanner(page);
  await acceptCookies(page);
});

test('should show product cards with Add to Basket button on the main page', async ({ page }) => {
  await expectFirstCardVisible(page);
  await expectFirstCardHasAddButton(page);
});

test('should show matching product for existing search query', async ({ page }) => {
  await searchProduct(page, SEARCH.existingQuery);
  await expectProductCardShown(page, PRODUCT_NAME);
});

test('should show no results message for missing search query', async ({ page }) => {
  await searchProduct(page, SEARCH.missingQuery);
  await expectNoSearchResults(page);
});
