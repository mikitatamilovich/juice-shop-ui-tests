const { HEADERS } = require('../../config/api.constants');

/**
 * Parses a response body as JSON, falling back to raw text (error pages are not JSON).
 * @param {import('@playwright/test').APIResponse} response - Playwright API response.
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
 * @param {Record<string, string>} [extraHeaders] - Additional headers.
 * @returns {Record<string, string>} Headers object.
 */
function buildHeaders(token, extraHeaders) {
  const headers = { ...extraHeaders };
  if (token) {
    headers[HEADERS.authorization] = `${HEADERS.bearerPrefix}${token}`;
  }
  return headers;
}

/**
 * Sends an HTTP request with the Playwright request fixture.
 * The JSON body is serialized and the Content-Type header is set by Playwright.
 * @param {import('@playwright/test').APIRequestContext} request - Playwright request context.
 * @param {string} method - HTTP method.
 * @param {string} path - Path with query string, relative to the baseURL from the config.
 * @param {{token?: string, body?: object, baseUrl?: string, headers?: Record<string, string>}}
 * [options] - Request options. Pass baseUrl to call another service.
 * @returns {Promise<{status: number, body: any}>} Status code and parsed body.
 */
async function sendRequest(request, method, path, options = {}) {
  const { token, body, baseUrl = '', headers } = options;
  const response = await request.fetch(`${baseUrl}${path}`, {
    method,
    headers: buildHeaders(token, headers),
    data: body,
  });
  return { status: response.status(), body: await parseBody(response) };
}

module.exports = { sendRequest };
