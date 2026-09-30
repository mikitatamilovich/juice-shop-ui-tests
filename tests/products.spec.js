const { test } = require('@playwright/test');
const { ROUTES, SEARCH } = require('../config/constants');
const { dismissPopups } = require('../src/utils/auth');
const { searchProduct } = require('../src/utils/search');
const {
  expectNoSearchResults,
  expectProductCardsShown,
  expectSearchResultsCount,
} = require('../src/utils/asserts');

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.home);
  await dismissPopups(page);
});

test('should show product cards on the main page', async ({ page }) => {
  await expectProductCardsShown(page);
});

test('should find products by existing query', async ({ page }) => {
  await searchProduct(page, SEARCH.existingQuery);
  await expectSearchResultsCount(page, SEARCH.existingResultsCount);
});

test('should show no results for missing query', async ({ page }) => {
  await searchProduct(page, SEARCH.missingQuery);
  await expectNoSearchResults(page);
});
