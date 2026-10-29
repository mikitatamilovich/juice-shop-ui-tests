const { expect } = require('@playwright/test');
const { ATTRIBUTES, MESSAGES, ROUTES, UI_TEXT } = require('../../config/constants');
const { requireValue } = require('../utils/validate');
const { BasePage } = require('./BasePage');

/** Page object for the account menu and the login form. */
class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page - Playwright page object.
   */
  constructor(page) {
    super(page);
    this.accountMenu = page.getByRole('button', { name: UI_TEXT.accountMenuButton });
    this.loginMenuItem = page.getByRole('menuitem', { name: UI_TEXT.loginMenuItem });
    this.profileMenuItem = page.getByRole('menuitem', { name: UI_TEXT.profileMenuItem });
    this.emailInput = page.getByLabel(UI_TEXT.emailField);
    this.passwordInput = page.getByLabel(UI_TEXT.passwordField);
    // The button name changes between "display" and "hide" after every click.
    this.passwordToggle = page.getByRole('button', { name: UI_TEXT.passwordToggleButton });
    // exact: true avoids matching other buttons whose name contains "Login".
    this.submitButton = page.getByRole('button', { name: UI_TEXT.loginButton, exact: true });
    this.invalidLoginMessage = page.getByText(MESSAGES.invalidLogin);
    this.emptyEmailMessage = page.getByText(MESSAGES.emptyEmail);
  }

  /**
   * Opens the Account menu in the toolbar.
   * @returns {Promise<void>} Resolves after the menu button is clicked.
   */
  async openAccountMenu() {
    await this.accountMenu.click();
  }

  /**
   * Opens the login form via Account -> Login.
   * @returns {Promise<void>} Resolves when the login form is opened.
   */
  async openLoginForm() {
    await this.openAccountMenu();
    await this.loginMenuItem.click();
  }

  /**
   * Fills the email field (the value may be empty for negative scenarios).
   * @param {string} email - Email to enter.
   * @returns {Promise<void>} Resolves when the field is filled.
   */
  async fillEmail(email) {
    await this.emailInput.fill(email);
  }

  /**
   * Fills the password field (the value may be empty for negative scenarios).
   * @param {string} password - Password to enter.
   * @returns {Promise<void>} Resolves when the field is filled.
   */
  async fillPassword(password) {
    await this.passwordInput.fill(password);
  }

  /**
   * Submits the login form.
   * @returns {Promise<void>} Resolves after the submit button is clicked.
   */
  async submit() {
    await this.submitButton.click();
  }

  /**
   * Waits until the application redirects to the search page after login.
   * @returns {Promise<void>} Resolves when the redirect is finished.
   */
  async waitForRedirect() {
    await this.page.waitForURL(new RegExp(ROUTES.search));
  }

  /**
   * Clicks the "show/hide password" button.
   * @returns {Promise<void>} Resolves after the click.
   */
  async togglePasswordVisibility() {
    await this.passwordToggle.click();
  }

  /**
   * Full login flow: open the form, fill it, submit and wait for the redirect.
   * Composes the single-action methods above.
   * @param {string} email - User email.
   * @param {string} password - User password.
   * @returns {Promise<void>} Resolves after the login is complete.
   * @throws {Error} If email or password is empty.
   */
  async login(email, password) {
    requireValue(email, 'Email');
    requireValue(password, 'Password');
    await this.openLoginForm();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
    await this.waitForRedirect();
  }

  /**
   * Checks that the profile menu item shows the user email. The Account menu must be open.
   * @param {string} email - Email of the logged in user.
   * @returns {Promise<void>} Resolves when the check passes.
   * @throws {Error} If the email is empty.
   */
  async expectLoggedIn(email) {
    requireValue(email, 'Email');
    await expect(this.profileMenuItem).toContainText(email);
  }

  /**
   * Checks that the invalid credentials message is shown.
   * @returns {Promise<void>} Resolves when the check passes.
   */
  async expectInvalidLogin() {
    await expect(this.invalidLoginMessage).toBeVisible();
  }

  /**
   * Checks that the login button is disabled.
   * @returns {Promise<void>} Resolves when the check passes.
   */
  async expectLoginDisabled() {
    await expect(this.submitButton).toBeDisabled();
  }

  /**
   * Checks that the empty email error is shown.
   * @returns {Promise<void>} Resolves when the check passes.
   */
  async expectEmptyEmailError() {
    await expect(this.emptyEmailMessage).toBeVisible();
  }

  /**
   * Checks the type attribute of the password input.
   * @param {string} type - Expected input type: "password" or "text".
   * @returns {Promise<void>} Resolves when the check passes.
   * @throws {Error} If the type is empty.
   */
  async expectPasswordInputType(type) {
    requireValue(type, 'Input type');
    await expect(this.passwordInput).toHaveAttribute(ATTRIBUTES.type, type);
  }
}

module.exports = { LoginPage };
