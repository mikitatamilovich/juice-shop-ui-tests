const { randomUUID } = require('node:crypto');
const {
  API_PATHS,
  HTTP_STATUS,
  TEST_EMAIL,
  TEST_USER_PASSWORD,
} = require('../../config/constants');
const { NetworkError } = require('./errors');

/**
 * Builds a unique email so every test works with its own user.
 * @returns {string} Unique email address.
 */
function buildUniqueEmail() {
  const suffix = randomUUID().slice(0, 8);
  return `${TEST_EMAIL.prefix}.${suffix}@${TEST_EMAIL.domain}`;
}

/**
 * Registers a user through the application API.
 * @param {import('@playwright/test').APIRequestContext} request - Playwright API request context.
 * @param {string} email - Email of the new user.
 * @param {string} password - Password of the new user.
 * @returns {Promise<void>} Resolves when the user is created.
 * @throws {Error} If email or password is empty.
 * @throws {NetworkError} If the API does not respond with 201.
 */
async function registerUser(request, email, password) {
  if (!email || !password) {
    throw new Error('Email and password must be provided');
  }
  const response = await request.post(API_PATHS.users, {
    data: { email, password, passwordRepeat: password },
  });
  if (response.status() !== HTTP_STATUS.created) {
    const body = await response.text();
    throw new NetworkError(`User registration failed: ${body}`, response.status());
  }
}

/**
 * Creates a new unique user with the default test password.
 * @param {import('@playwright/test').APIRequestContext} request - Playwright API request context.
 * @returns {Promise<{email: string, password: string}>} Credentials of the created user.
 */
async function createTestUser(request) {
  const email = buildUniqueEmail();
  await registerUser(request, email, TEST_USER_PASSWORD);
  return { email, password: TEST_USER_PASSWORD };
}

module.exports = { buildUniqueEmail, registerUser, createTestUser };
