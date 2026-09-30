const { SELECTORS, UI_TEXT } = require('../../config/constants');

/**
 * Dismisses the welcome banner and the cookie consent popups.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when both popups are closed.
 */
async function dismissPopups(page) {
  await page.getByRole('button', { name: UI_TEXT.dismissButton }).click();
  await page.getByRole('button', { name: UI_TEXT.cookieButton }).click();
}

/**
 * Opens the login form via Account -> Login.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the login form is opened.
 */
async function openLoginForm(page) {
  await page.locator(SELECTORS.accountMenu).click();
  await page.locator(SELECTORS.loginMenuItem).click();
}

/**
 * Fills the email and password fields of the login form.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} email - Email to enter (may be empty for negative scenarios).
 * @param {string} password - Password to enter.
 * @returns {Promise<void>} Resolves when both fields are filled.
 */
async function fillLoginForm(page, email, password) {
  await page.getByLabel(UI_TEXT.emailLabel).fill(email);
  await page.getByLabel(UI_TEXT.passwordLabel).fill(password);
}

/**
 * Logs in through the Account menu.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @returns {Promise<void>} Resolves after the login form is submitted.
 * @throws {Error} If email or password is empty.
 */
async function login(page, email, password) {
  if (!email || !password) {
    throw new Error('Email and password must be provided');
  }
  await openLoginForm(page);
  await fillLoginForm(page, email, password);
  await page.getByRole('button', { name: UI_TEXT.loginButton }).click();
}

module.exports = { dismissPopups, openLoginForm, fillLoginForm, login };
