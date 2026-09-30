const { SELECTORS } = require('../../config/constants');

/**
 * Searches for a product using the search bar in the toolbar.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} query - Text to search for.
 * @returns {Promise<void>} Resolves after the search is submitted.
 * @throws {Error} If the query is empty.
 */
async function searchProduct(page, query) {
  if (!query) {
    throw new Error('Search query must be provided');
  }
  await page.locator(SELECTORS.searchIcon).click();
  await page.locator(SELECTORS.searchInput).fill(query);
  await page.locator(SELECTORS.searchInput).press('Enter');
}

module.exports = { searchProduct };
