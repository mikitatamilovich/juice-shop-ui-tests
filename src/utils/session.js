const { ROUTES } = require('../../config/constants');
const { createTestUser } = require('./api');
const { dismissPopups, login } = require('./auth');

/**
 * Creates a new user through the API, opens the app and logs in.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {import('@playwright/test').APIRequestContext} request - Playwright API request context.
 * @returns {Promise<{email: string, password: string}>} Credentials of the logged in user.
 */
async function startLoggedInSession(page, request) {
  const user = await createTestUser(request);
  await page.goto(ROUTES.home);
  await dismissPopups(page);
  await login(page, user.email, user.password);
  return user;
}

module.exports = { startLoggedInSession };
