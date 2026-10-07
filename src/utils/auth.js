const { ROUTES, UI_TEXT } = require('../../config/constants');
const { requireValue } = require('./validate');

/**
 * Closes the welcome banner.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves after the close button is clicked.
 */
async function dismissWelcomeBanner(page) {
  await page.getByRole('button', { name: UI_TEXT.welcomeCloseButton }).click();
}

/**
 * Accepts the cookie consent message.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves after the dismiss button is clicked.
 */
async function acceptCookies(page) {
  await page.getByRole('button', { name: UI_TEXT.cookieButton }).click();
}

/**
 * Opens the Account menu in the toolbar.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves after the menu button is clicked.
 */
async function openAccountMenu(page) {
  await page.getByRole('button', { name: UI_TEXT.accountMenuButton }).click();
}

/**
 * Opens the login form via Account -> Login.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the login form is opened.
 */
async function openLoginForm(page) {
  await openAccountMenu(page);
  await page.getByRole('menuitem', { name: UI_TEXT.loginMenuItem }).click();
}

/**
 * Fills the email field (the value may be empty for negative scenarios).
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} email - Email to enter.
 * @returns {Promise<void>} Resolves when the field is filled.
 */
async function fillEmail(page, email) {
  await page.getByLabel(UI_TEXT.emailField).fill(email);
}

/**
 * Fills the password field (the value may be empty for negative scenarios).
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} password - Password to enter.
 * @returns {Promise<void>} Resolves when the field is filled.
 */
async function fillPassword(page, password) {
  await page.getByLabel(UI_TEXT.passwordField).fill(password);
}

/**
 * Submits the login form.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves after the submit button is clicked.
 */
async function submitLoginForm(page) {
  // exact: true avoids matching other buttons whose name contains "Login".
  await page.getByRole('button', { name: UI_TEXT.loginButton, exact: true }).click();
}

/**
 * Clicks the "show/hide password" button (its name changes after every click).
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves after the click.
 */
async function togglePasswordVisibility(page) {
  await page.getByRole('button', { name: UI_TEXT.passwordToggleButton }).click();
}

/**
 * Waits until the application redirects to the search page after a successful login.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the redirect is finished.
 */
async function waitForLoginRedirect(page) {
  await page.waitForURL(new RegExp(ROUTES.search));
}

/**
 * Full login flow: open the form, fill it, submit and wait for the redirect.
 * Composes the single-action functions above.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @returns {Promise<void>} Resolves after the login is complete.
 * @throws {Error} If email or password is empty.
 */
async function login(page, email, password) {
  requireValue(email, 'Email');
  requireValue(password, 'Password');
  await openLoginForm(page);
  await fillEmail(page, email);
  await fillPassword(page, password);
  await submitLoginForm(page);
  await waitForLoginRedirect(page);
}

module.exports = {
  dismissWelcomeBanner,
  acceptCookies,
  openAccountMenu,
  openLoginForm,
  fillEmail,
  fillPassword,
  submitLoginForm,
  togglePasswordVisibility,
  login,
};
