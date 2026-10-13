const { loginSession } = require('./auth');
const { createTestUser } = require('./users');

/**
 * Registers a new user and logs in with it.
 * @returns {Promise<{email: string, password: string, token: string, basketId: number}>} Ready account.
 */
async function createAccount() {
  const user = await createTestUser();
  const session = await loginSession(user.email, user.password);
  return { ...user, ...session };
}

module.exports = { createAccount };
