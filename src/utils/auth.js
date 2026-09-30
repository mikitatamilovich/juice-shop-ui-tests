const { ROUTES, SELECTORS, UI_TEXT } = require('../../config/constants');
const { requireValue } = require('./validate');

/**
 * Dismisses the welcome banner and the cookie consent popups.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when both popups are closed.
 */
async function dismissPopups(page) {
  await page.getByRole('button', { name: UI_TEXT.welcomeCloseButton }).click();
  await page.getByRole('button', { name: UI_TEXT.cookieButton }).click();
}

/**
 * Opens the Account menu in the toolbar.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves after the menu button is clicked.
 */
async function openAccountMenu(page) {
  await page.locator(SELECTORS.accountMenu).click();
}

/**
 * Opens the login form via Account -> Login.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the login form is opened.
 */
async function openLoginForm(page) {
  await openAccountMenu(page);
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
  await page.locator(SELECTORS.emailInput).fill(email);
  await page.locator(SELECTORS.passwordInput).fill(password);
}

/**
 * Submits the login form.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves after the submit button is clicked.
 */
async function submitLoginForm(page) {
  await page.locator(SELECTORS.loginSubmit).click();
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
 * Logs in through the Account menu and waits for the redirect.
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
  await fillLoginForm(page, email, password);
  await submitLoginForm(page);
  await waitForLoginRedirect(page);
}

module.exports = {
  dismissPopups,
  openAccountMenu,
  openLoginForm,
  fillLoginForm,
  submitLoginForm,
  waitForLoginRedirect,
  login,
};
