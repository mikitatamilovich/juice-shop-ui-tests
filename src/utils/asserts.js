const { expect } = require('@playwright/test');
const { ATTRIBUTES, MESSAGES, ROUTES, SELECTORS, UI_TEXT } = require('../../config/constants');
const { requireValue } = require('./validate');

/**
 * Checks that the user is logged in: the profile menu item shows the user email.
 * The Account menu must already be open.
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
  await expect(page.locator(SELECTORS.loginSubmit)).toBeDisabled();
}

/**
 * Checks that the empty email error is shown and login is blocked.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when both checks pass.
 */
async function expectEmptyEmailBlocked(page) {
  await expect(page.getByText(MESSAGES.emptyEmail)).toBeVisible();
  await expectLoginDisabled(page);
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
  await expect(page.locator(SELECTORS.passwordInput)).toHaveAttribute(ATTRIBUTES.type, type);
}

/**
 * Checks that neither the welcome banner nor the cookie banner is shown.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when all checks pass.
 */
async function expectPopupsHidden(page) {
  await expect(page.getByRole('button', { name: UI_TEXT.homeButton })).toBeVisible();
  await expect(page.getByRole('button', { name: UI_TEXT.welcomeCloseButton })).toBeHidden();
  await expect(page.getByRole('button', { name: UI_TEXT.cookieButton })).toBeHidden();
}

/**
 * Checks that product cards are shown and have an Add to Basket button.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when both checks pass.
 */
async function expectProductCardsShown(page) {
  const firstCard = page.locator(SELECTORS.productCard).first();
  await expect(firstCard).toBeVisible();
  await expect(firstCard.getByRole('button', { name: UI_TEXT.addToBasketButton })).toBeVisible();
}

/**
 * Checks the number of product cards in the search results.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {number} count - Expected number of cards.
 * @returns {Promise<void>} Resolves when the check passes.
 * @throws {Error} If the count is not provided.
 */
async function expectSearchResultsCount(page, count) {
  requireValue(count, 'Expected count');
  await expect(page.locator(SELECTORS.productCard)).toHaveCount(count);
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
 * This replaces a fixed hard wait: the check retries until the notification appears.
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
 * Checks that the basket contains the product and checkout is available.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} productName - Name of the product expected in the basket.
 * @returns {Promise<void>} Resolves when both checks pass.
 * @throws {Error} If the product name is empty.
 */
async function expectProductInBasket(page, productName) {
  requireValue(productName, 'Product name');
  await expect(page.locator(SELECTORS.basketRow).filter({ hasText: productName })).toBeVisible();
  await expect(page.getByRole('button', { name: UI_TEXT.checkoutButton })).toBeEnabled();
}

/**
 * Checks the total price shown on the basket page.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} price - Expected total, for example "3.98".
 * @returns {Promise<void>} Resolves when the check passes.
 * @throws {Error} If the price is empty.
 */
async function expectTotalPrice(page, price) {
  requireValue(price, 'Price');
  await expect(page.locator(SELECTORS.totalPrice)).toContainText(price);
}

/**
 * Checks that the basket page is open and contains no products.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @returns {Promise<void>} Resolves when both checks pass.
 */
async function expectBasketEmpty(page) {
  await expect(page).toHaveURL(new RegExp(ROUTES.basket));
  await expect(page.locator(SELECTORS.basketRow)).toHaveCount(0);
}

module.exports = {
  expectLoggedIn,
  expectInvalidLogin,
  expectLoginDisabled,
  expectEmptyEmailBlocked,
  expectPasswordInputType,
  expectPopupsHidden,
  expectProductCardsShown,
  expectSearchResultsCount,
  expectNoSearchResults,
  expectSnackBar,
  expectProductAdded,
  expectProductAddedAgain,
  expectProductInBasket,
  expectTotalPrice,
  expectBasketEmpty,
};
