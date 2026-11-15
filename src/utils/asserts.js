const { expect } = require('@playwright/test');
const { ATTRIBUTES, MESSAGES, ROUTES, SELECTORS, UI_TEXT } = require('../../config/constants');
const { requireValue } = require('./validate');

/**
 * Checks that the profile menu item shows the user email. The Account menu must be open.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} email - Email of the logged in user.
 * @returns {Promise<void>} Resolves when the check passes.
 * @throws {Error} If the email is empty.
 */
async function expectLoggedIn(page, email) {
  requireValue(email, 'Email');
  await expect(page.getByRole('menuitem', { name: UI_TEXT.profileMenuItem })).toContainText(email);
}

/**
 * Checks that the invalid credentials message is shown.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the check passes.
 */
async function expectInvalidLogin(page) {
  await expect(page.getByText(MESSAGES.invalidLogin)).toBeVisible();
}

/**
 * Checks that the login button is disabled.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the check passes.
 */
async function expectLoginDisabled(page) {
  await expect(page.getByRole('button', { name: UI_TEXT.loginButton, exact: true })).toBeDisabled();
}

/**
 * Checks that the empty email error is shown.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the check passes.
 */
async function expectEmptyEmailError(page) {
  await expect(page.getByText(MESSAGES.emptyEmail)).toBeVisible();
}

/**
 * Checks the type attribute of the password input.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} type - Expected input type: "password" or "text".
 * @returns {Promise<void>} Resolves when the check passes.
 * @throws {Error} If the type is empty.
 */
async function expectPasswordInputType(page, type) {
  requireValue(type, 'Input type');
  await expect(page.getByLabel(UI_TEXT.passwordField)).toHaveAttribute(ATTRIBUTES.type, type);
}

/**
 * Checks that the home button is visible.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the check passes.
 */
async function expectHomeButtonVisible(page) {
  await expect(page.getByRole('button', { name: UI_TEXT.homeButton })).toBeVisible();
}

/**
 * Checks that the home button shows the application name.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the check passes.
 */
async function expectAppNameShown(page) {
  await expect(page.getByRole('button', { name: UI_TEXT.homeButton })).toContainText(
    UI_TEXT.appHeading,
  );
}

/**
 * Checks that the welcome banner is not shown.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the check passes.
 */
async function expectWelcomeBannerHidden(page) {
  await expect(page.getByRole('button', { name: UI_TEXT.welcomeCloseButton })).toBeHidden();
}

/**
 * Checks that the cookie banner is not shown.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the check passes.
 */
async function expectCookieBannerHidden(page) {
  await expect(page.getByRole('button', { name: UI_TEXT.cookieButton })).toBeHidden();
}

/**
 * Checks that the first product card is visible.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the check passes.
 */
async function expectFirstCardVisible(page) {
  await expect(page.getByRole('article').first()).toBeVisible();
}

/**
 * Checks that the first product card has an Add to Basket button.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the check passes.
 */
async function expectFirstCardHasAddButton(page) {
  const firstCard = page.getByRole('article').first();
  await expect(firstCard.getByRole('button', { name: UI_TEXT.addToBasketButton })).toBeVisible();
}

/**
 * Checks that a product card with exactly the given name is shown.
 * The name is matched exactly, so "Apple Juice" does not match "Pineapple Juice".
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} productName - Product name as shown on the card.
 * @returns {Promise<void>} Resolves when the check passes.
 * @throws {Error} If the product name is empty.
 */
async function expectProductCardShown(page, productName) {
  requireValue(productName, 'Product name');
  const card = page
    .getByRole('article')
    .filter({ has: page.getByText(productName, { exact: true }) });
  await expect(card).toBeVisible();
}

/**
 * Checks that the "no results" message is shown.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the check passes.
 */
async function expectNoSearchResults(page) {
  await expect(page.getByText(MESSAGES.noResults)).toBeVisible();
}

/**
 * Checks that a snack-bar with the given text is shown.
 * Other snack-bars (for example the language notice) are ignored.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} message - Text expected inside the snack-bar.
 * @returns {Promise<void>} Resolves when the check passes.
 * @throws {Error} If the message is empty.
 */
async function expectSnackBar(page, message) {
  requireValue(message, 'Snack-bar message');
  await expect(page.locator(SELECTORS.snackBar).filter({ hasText: message })).toBeVisible();
}

/**
 * Checks that the "product added" snack-bar is shown.
 * Replaces a hard wait: the check retries until the notification appears.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} productName - Name of the added product.
 * @returns {Promise<void>} Resolves when the check passes.
 * @throws {Error} If the product name is empty.
 */
async function expectProductAdded(page, productName) {
  requireValue(productName, 'Product name');
  await expectSnackBar(page, MESSAGES.productAdded(productName));
}

/**
 * Checks that the "added another" snack-bar is shown.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} productName - Name of the product added again.
 * @returns {Promise<void>} Resolves when the check passes.
 * @throws {Error} If the product name is empty.
 */
async function expectProductAddedAgain(page, productName) {
  requireValue(productName, 'Product name');
  await expectSnackBar(page, MESSAGES.productAddedAgain(productName));
}

/**
 * Checks that the basket contains the product.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} productName - Name of the product expected in the basket.
 * @returns {Promise<void>} Resolves when the check passes.
 * @throws {Error} If the product name is empty.
 */
async function expectProductInBasket(page, productName) {
  requireValue(productName, 'Product name');
  await expect(page.getByRole('row').filter({ hasText: productName })).toBeVisible();
}

/**
 * Checks that the basket does not contain the product.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} productName - Name of the product that must be absent.
 * @returns {Promise<void>} Resolves when the check passes.
 * @throws {Error} If the product name is empty.
 */
async function expectProductAbsentFromBasket(page, productName) {
  requireValue(productName, 'Product name');
  await expect(page.getByRole('row').filter({ hasText: productName })).toHaveCount(0);
}

/**
 * Checks that the basket page is open.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the check passes.
 */
async function expectBasketOpen(page) {
  await expect(page).toHaveURL(new RegExp(ROUTES.basket));
}

/**
 * Checks that the checkout button is enabled.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when the check passes.
 */
async function expectCheckoutEnabled(page) {
  await expect(page.getByRole('button', { name: UI_TEXT.checkoutButton })).toBeEnabled();
}

/**
 * Checks the total price shown on the basket page.
 * The label prefix makes the match exact ("Total Price: 1.99" does not match "11.99").
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} price - Expected total, for example "3.98".
 * @returns {Promise<void>} Resolves when the check passes.
 * @throws {Error} If the price is empty.
 */
async function expectTotalPrice(page, price) {
  requireValue(price, 'Price');
  await expect(page.getByText(`${UI_TEXT.totalPriceLabel}${price}`)).toBeVisible();
}

module.exports = {
  expectLoggedIn,
  expectInvalidLogin,
  expectLoginDisabled,
  expectEmptyEmailError,
  expectPasswordInputType,
  expectHomeButtonVisible,
  expectAppNameShown,
  expectWelcomeBannerHidden,
  expectCookieBannerHidden,
  expectFirstCardVisible,
  expectFirstCardHasAddButton,
  expectProductCardShown,
  expectNoSearchResults,
  expectSnackBar,
  expectProductAdded,
  expectProductAddedAgain,
  expectProductInBasket,
  expectProductAbsentFromBasket,
  expectBasketOpen,
  expectCheckoutEnabled,
  expectTotalPrice,
};
