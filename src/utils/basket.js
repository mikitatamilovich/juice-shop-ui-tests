const { SELECTORS, UI_TEXT } = require('../../config/constants');
const { requireValue } = require('./validate');

/**
 * Clicks Add to Basket on the card of the given product.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} productName - Product name as shown on the card.
 * @returns {Promise<void>} Resolves after the button is clicked.
 * @throws {Error} If the product name is empty.
 */
async function addProductToBasket(page, productName) {
  requireValue(productName, 'Product name');
  const product = page.locator(SELECTORS.productCard).filter({ hasText: productName });
  await product.getByRole('button', { name: UI_TEXT.addToBasketButton }).click();
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
 * The remove button is the last button in the product row.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} productName - Product name as shown in the basket.
 * @returns {Promise<void>} Resolves after the remove button is clicked.
 * @throws {Error} If the product name is empty.
 */
async function removeProductFromBasket(page, productName) {
  requireValue(productName, 'Product name');
  const row = page.locator(SELECTORS.basketRow).filter({ hasText: productName });
  await row.getByRole('button').last().click();
}

module.exports = { addProductToBasket, openBasket, removeProductFromBasket };
