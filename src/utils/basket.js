const { UI_TEXT } = require('../../config/constants');
const { requireValue } = require('./validate');

/**
 * Clicks Add to Basket on the card of the given product.
 * The name is matched exactly, so "Apple Juice" does not match "Pineapple Juice".
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} productName - Product name as shown on the card.
 * @returns {Promise<void>} Resolves after the button is clicked.
 * @throws {Error} If the product name is empty.
 */
async function addProductToBasket(page, productName) {
  requireValue(productName, 'Product name');
  const card = page
    .getByRole('article')
    .filter({ has: page.getByText(productName, { exact: true }) });
  await card.getByRole('button', { name: UI_TEXT.addToBasketButton }).click();
}

/**
 * Opens the basket page.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves after the basket button is clicked.
 */
async function openBasket(page) {
  await page.getByRole('button', { name: UI_TEXT.basketButton }).click();
}

/**
 * Removes the given product from the basket page.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} productName - Product name as shown in the basket.
 * @returns {Promise<void>} Resolves after the remove button is clicked.
 * @throws {Error} If the product name is empty.
 */
async function removeProductFromBasket(page, productName) {
  requireValue(productName, 'Product name');
  const row = page.getByRole('row').filter({ hasText: productName });
  // The remove button has no accessible name, it is the last button in the row.
  await row.getByRole('button').last().click();
}

module.exports = { addProductToBasket, openBasket, removeProductFromBasket };
