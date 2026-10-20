const { loginSession } = require('./auth');
const { createTestUser } = require('../utils/api');

/**
 * Registers a new user and logs in with it.
 * @param {import('@playwright/test').APIRequestContext} request - Playwright request context.
 * @returns {Promise<{email: string, password: string, token: string, basketId: number}>} Ready account.
 */
async function createAccount(request) {
  const user = await createTestUser(request);
  const session = await loginSession(request, user.email, user.password);
  return { ...user, ...session };
}

module.exports = { createAccount };
