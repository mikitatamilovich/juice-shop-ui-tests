const { expect } = require('@playwright/test');
const { KEYS, MESSAGES, SELECTORS, UI_TEXT } = require('../../config/constants');
const { requireValue } = require('../utils/validate');
const { productNameMatcher } = require('../utils/regex');
const { BasePage } = require('./BasePage');

/** Page object for the product grid and the search bar. */
class ProductsPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page object.
   */
  constructor(page) {
    super(page);
    this.cards = page.getByRole('article');
    this.searchButton = page.getByRole('button', { name: UI_TEXT.openSearchButton });
    // The search input has no accessible name, so a CSS selector is used.
    this.searchInput = page.locator(SELECTORS.searchInput);
    this.noResultsText = page.getByText(MESSAGES.noResults);
  }

  /**
   * Returns the card of the product with the given name.
   * The match is case-sensitive, so "Apple Juice" does not match "Pineapple Juice".
   * @param {string} productName - Product name as shown on the card.
   * @returns {import('@playwright/test').Locator} Locator of the card.
   * @throws {Error} If the product name is empty.
   */
  productCard(productName) {
    requireValue(productName, 'Product name');
    return this.cards.filter({ hasText: productNameMatcher(productName) });
  }

  /**
   * Clicks Add to Basket on the card of the given product.
   * @param {string} productName - Product name as shown on the card.
   * @returns {Promise<void>} Resolves after the button is clicked.
   * @throws {Error} If the product name is empty.
   */
  async addToBasket(productName) {
    await this.productCard(productName)
      .getByRole('button', { name: UI_TEXT.addToBasketButton })
      .click();
  }

  /**
   * Searches for a product using the search bar in the toolbar.
   * @param {string} query - Text to search for.
   * @returns {Promise<void>} Resolves after the search is submitted.
   * @throws {Error} If the query is empty.
   */
  async search(query) {
    requireValue(query, 'Search query');
    await this.searchButton.click();
    await this.searchInput.fill(query);
    await this.searchInput.press(KEYS.enter);
  }

  /**
   * Checks that the first product card is visible.
   * @returns {Promise<void>} Resolves when the check passes.
   */
  async expectFirstCardVisible() {
    await expect(this.cards.first()).toBeVisible();
  }

  /**
   * Checks that the first product card has an Add to Basket button.
   * @returns {Promise<void>} Resolves when the check passes.
   */
  async expectFirstCardHasAddButton() {
    await expect(
      this.cards.first().getByRole('button', { name: UI_TEXT.addToBasketButton }),
    ).toBeVisible();
  }

  /**
   * Checks that the card of the given product is shown.
   * @param {string} productName - Product name as shown on the card.
   * @returns {Promise<void>} Resolves when the check passes.
   * @throws {Error} If the product name is empty.
   */
  async expectProductShown(productName) {
    await expect(this.productCard(productName)).toBeVisible();
  }

  /**
   * Checks that the "no results" message is shown.
   * @returns {Promise<void>} Resolves when the check passes.
   */
  async expectNoResults() {
    await expect(this.noResultsText).toBeVisible();
  }

  /**
   * Checks that the "product added" snack-bar is shown.
   * @param {string} productName - Name of the added product.
   * @returns {Promise<void>} Resolves when the check passes.
   * @throws {Error} If the product name is empty.
   */
  async expectProductAdded(productName) {
    requireValue(productName, 'Product name');
    await this.expectSnackBar(MESSAGES.productAdded(productName));
  }

  /**
   * Checks that the "added another" snack-bar is shown.
   * @param {string} productName - Name of the product added again.
   * @returns {Promise<void>} Resolves when the check passes.
   * @throws {Error} If the product name is empty.
   */
  async expectProductAddedAgain(productName) {
    requireValue(productName, 'Product name');
    await this.expectSnackBar(MESSAGES.productAddedAgain(productName));
  }
}

module.exports = { ProductsPage };
