const { HEADERS } = require('../../config/api.constants');
const { BASE_URL } = require('../../config/constants');

/**
 * Parses a response body as JSON, falling back to raw text (error pages are not JSON).
 * @param {Response} response - Fetch response.
 * @returns {Promise<any>} Parsed JSON or the raw text.
 */
async function parseBody(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Builds the request headers.
 * @param {string|undefined} token - JWT token, omitted for unauthorized requests.
 * @param {boolean} hasBody - Whether the request has a JSON body.
 * @returns {Record<string, string>} Headers object.
 */
function buildHeaders(token, hasBody) {
  const headers = {};
  if (hasBody) {
    headers[HEADERS.contentType] = HEADERS.json;
  }
  if (token) {
    headers[HEADERS.authorization] = `${HEADERS.bearerPrefix}${token}`;
  }
  return headers;
}

/**
 * Sends an HTTP request with the built-in fetch.
 * @param {string} method - HTTP method.
 * @param {string} path - Path with query string, relative to the base URL.
 * @param {{token?: string, body?: object, baseUrl?: string}} [options] - Request options.
 * @returns {Promise<{status: number, body: any}>} Status code and parsed body.
 */
async function sendRequest(method, path, options = {}) {
  const { token, body, baseUrl = BASE_URL } = options;
  const hasBody = body !== undefined;
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: buildHeaders(token, hasBody),
    body: hasBody ? JSON.stringify(body) : undefined,
  });
  return { status: response.status, body: await parseBody(response) };
}

module.exports = { sendRequest };
