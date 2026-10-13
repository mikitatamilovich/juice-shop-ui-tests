const { API_ENDPOINTS, API_STATUS, HTTP_METHOD } = require('../../config/api.constants');
const { TEST_USER_PASSWORD } = require('../../config/constants');
const { buildUniqueEmail } = require('../utils/api');
const { NetworkError } = require('../utils/errors');
const { sendRequest } = require('./http');

/**
 * Registers a new user with a unique email and the default test password.
 * @returns {Promise<{email: string, password: string}>} Credentials of the created user.
 * @throws {NetworkError} If the registration does not return 201.
 */
async function createTestUser() {
  const email = buildUniqueEmail();
  const password = TEST_USER_PASSWORD;
  const response = await sendRequest(HTTP_METHOD.post, API_ENDPOINTS.users, {
    body: { email, password, passwordRepeat: password },
  });
  if (response.status !== API_STATUS.created) {
    throw new NetworkError(
      `Registration failed: ${JSON.stringify(response.body)}`,
      response.status,
    );
  }
  return { email, password };
}

module.exports = { createTestUser };
