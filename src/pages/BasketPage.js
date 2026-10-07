const { expect } = require('@playwright/test');
const { ROUTES, UI_TEXT } = require('../../config/constants');
const { requireValue } = require('../utils/validate');
const { BasePage } = require('./BasePage');

/** Page object for the basket page. */
class BasketPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page object.
   */
  constructor(page) {
    super(page);
    this.basketButton = page.getByRole('button', { name: UI_TEXT.basketButton });
    this.rows = page.getByRole('row');
    this.checkoutButton = page.getByRole('button', { name: UI_TEXT.checkoutButton });
  }

  /**
   * Returns the basket row of the given product.
   * @param {string} productName - Product name as shown in the basket.
   * @returns {import('@playwright/test').Locator} Locator of the row.
   * @throws {Error} If the product name is empty.
   */
  productRow(productName) {
    requireValue(productName, 'Product name');
    return this.rows.filter({ hasText: productName });
  }

  /**
   * Opens the basket page through the toolbar button.
   * Named differently from BasePage.open() on purpose: that one opens the home page.
   * @returns {Promise<void>} Resolves after the basket button is clicked.
   */
  async openBasket() {
    await this.basketButton.click();
  }

  /**
   * Removes the given product from the basket.
   * @param {string} productName - Product name as shown in the basket.
   * @returns {Promise<void>} Resolves after the remove button is clicked.
   * @throws {Error} If the product name is empty.
   */
  async removeProduct(productName) {
    // The remove button has no accessible name, it is the last button in the row.
    await this.productRow(productName).getByRole('button').last().click();
  }

  /**
   * Checks that the basket contains the product.
   * @param {string} productName - Name of the product expected in the basket.
   * @returns {Promise<void>} Resolves when the check passes.
   * @throws {Error} If the product name is empty.
   */
  async expectProductInBasket(productName) {
    await expect(this.productRow(productName)).toBeVisible();
  }

  /**
   * Checks that the basket does not contain the product.
   * @param {string} productName - Name of the product that must be absent.
   * @returns {Promise<void>} Resolves when the check passes.
   * @throws {Error} If the product name is empty.
   */
  async expectProductAbsent(productName) {
    await expect(this.productRow(productName)).toHaveCount(0);
  }

  /**
   * Checks the total price shown on the basket page.
   * The label prefix makes the match exact ("Total Price: 1.99" does not match "11.99").
   * @param {string} price - Expected total, for example "3.98".
   * @returns {Promise<void>} Resolves when the check passes.
   * @throws {Error} If the price is empty.
   */
  async expectTotalPrice(price) {
    requireValue(price, 'Price');
    await expect(this.page.getByText(`${UI_TEXT.totalPriceLabel}${price}`)).toBeVisible();
  }

  /**
   * Checks that the checkout button is enabled.
   * @returns {Promise<void>} Resolves when the check passes.
   */
  async expectCheckoutEnabled() {
    await expect(this.checkoutButton).toBeEnabled();
  }

  /**
   * Checks that the basket page is open.
   * @returns {Promise<void>} Resolves when the check passes.
   */
  async expectOpen() {
    await expect(this.page).toHaveURL(new RegExp(ROUTES.basket));
  }
}

module.exports = { BasketPage };
