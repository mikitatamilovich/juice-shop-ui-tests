const { API_ENDPOINTS, API_STATUS, HTTP_METHOD } = require('../../config/api.constants');
const { NetworkError } = require('../utils/errors');
const { decodeJwtPayload } = require('../utils/jwt');
const { sendRequest } = require('./http');

/**
 * Sends the login request and returns the raw response (used by negative tests).
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @returns {Promise<{status: number, body: any}>} Raw response.
 */
function requestLogin(email, password) {
  return sendRequest(HTTP_METHOD.post, API_ENDPOINTS.login, { body: { email, password } });
}

/**
 * Extracts the token and the basket id from a successful login response body.
 * The basket id comes from the body, the token payload is the fallback.
 * @param {{authentication: {token: string, bid?: number}}} body - Login response body.
 * @returns {{token: string, basketId: number}} Session data.
 */
function parseSession(body) {
  const { token, bid } = body.authentication;
  return { token, basketId: bid ?? decodeJwtPayload(token).bid };
}

/**
 * Logs in and returns the token together with the basket id.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @returns {Promise<{token: string, basketId: number}>} Session data.
 * @throws {NetworkError} If the login does not return 200.
 */
async function loginSession(email, password) {
  const response = await requestLogin(email, password);
  if (response.status !== API_STATUS.ok) {
    throw new NetworkError(`Login failed: ${JSON.stringify(response.body)}`, response.status);
  }
  return parseSession(response.body);
}

/**
 * Logs in and returns only the token.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @returns {Promise<string>} JWT token.
 */
async function login(email, password) {
  return (await loginSession(email, password)).token;
}

module.exports = { requestLogin, loginSession, login };
