const { expect } = require('@playwright/test');
const { SELECTORS } = require('../../config/constants');

/**
 * Checks that the user is logged in: the account menu shows the user email.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {string} email - Email of the logged in user.
 * @returns {Promise<void>} Resolves when the check passes.
 */
async function expectLoggedIn(page, email) {
  await page.locator(SELECTORS.accountMenu).click();
  await expect(page.getByText(email)).toBeVisible();
}

module.exports = { expectLoggedIn };
