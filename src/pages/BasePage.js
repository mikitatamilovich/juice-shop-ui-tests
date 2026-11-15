const { expect } = require('@playwright/test');
const { ROUTES, SELECTORS, UI_TEXT } = require('../../config/constants');
const { requireValue } = require('../utils/validate');

/** Base page object with actions shared by all pages. */
class BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page object.
   */
  constructor(page) {
    this.page = page;
    this.welcomeCloseButton = page.getByRole('button', { name: UI_TEXT.welcomeCloseButton });
    this.cookieButton = page.getByRole('button', { name: UI_TEXT.cookieButton });
    this.homeButton = page.getByRole('button', { name: UI_TEXT.homeButton });
    this.snackBar = page.locator(SELECTORS.snackBar);
  }

  /**
   * Opens the home page.
   * @returns {Promise<void>} Resolves when navigation is finished.
   */
  async open() {
    await this.page.goto(ROUTES.home);
  }

  /**
   * Reloads the current page.
   * @returns {Promise<void>} Resolves when the page is reloaded.
   */
  async reload() {
    await this.page.reload();
  }

  /**
   * Closes the welcome banner.
   * @returns {Promise<void>} Resolves after the close button is clicked.
   */
  async dismissWelcomeBanner() {
    await this.welcomeCloseButton.click();
  }

  /**
   * Accepts the cookie consent message.
   * @returns {Promise<void>} Resolves after the dismiss button is clicked.
   */
  async acceptCookies() {
    await this.cookieButton.click();
  }

  /**
   * Checks that the home button is visible.
   * @returns {Promise<void>} Resolves when the check passes.
   */
  async expectHomeButtonVisible() {
    await expect(this.homeButton).toBeVisible();
  }

  /**
   * Checks that the home button shows the application name.
   * @returns {Promise<void>} Resolves when the check passes.
   */
  async expectAppNameShown() {
    await expect(this.homeButton).toContainText(UI_TEXT.appHeading);
  }

  /**
   * Checks that the welcome banner is not shown.
   * @returns {Promise<void>} Resolves when the check passes.
   */
  async expectWelcomeBannerHidden() {
    await expect(this.welcomeCloseButton).toBeHidden();
  }

  /**
   * Checks that the cookie banner is not shown.
   * @returns {Promise<void>} Resolves when the check passes.
   */
  async expectCookieBannerHidden() {
    await expect(this.cookieButton).toBeHidden();
  }

  /**
   * Checks that a snack-bar with the given text is shown.
   * Replaces a hard wait: the check retries until the notification appears.
   * @param {string} message - Text expected inside the snack-bar.
   * @returns {Promise<void>} Resolves when the check passes.
   * @throws {Error} If the message is empty.
   */
  async expectSnackBar(message) {
    requireValue(message, 'Snack-bar message');
    await expect(this.snackBar.filter({ hasText: message })).toBeVisible();
  }
}

module.exports = { BasePage };
