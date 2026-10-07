const { createTestUser } = require('./api');
const { login } = require('./auth');

/**
 * Creates a new user through the API and logs in with it through the UI.
 * The application must already be open with the popups closed.
 * @param {import('@playwright/test').Page} page - Playwright page object.
 * @param {import('@playwright/test').APIRequestContext} request - Playwright API request context.
 * @returns {Promise<{email: string, password: string}>} Credentials of the logged in user.
 */
async function loginAsNewUser(page, request) {
  const user = await createTestUser(request);
  await login(page, user.email, user.password);
  return user;
}

module.exports = { loginAsNewUser };
