const { API_STATUS, HTTP_METHOD, REQRES } = require('../../config/api.constants');
const { NetworkError } = require('../utils/errors');
const { sendRequest } = require('./http');

/**
 * Requests one page of ReqRes users. The API key is sent when REQRES_API_KEY is set.
 * @param {import('@playwright/test').APIRequestContext} request - Playwright request context.
 * @param {number} page - Page number.
 * @returns {Promise<{status: number, body: any}>} Raw response.
 */
function fetchUsersPage(request, page) {
  const headers = REQRES.apiKey ? { [REQRES.apiKeyHeader]: REQRES.apiKey } : undefined;
  return sendRequest(request, HTTP_METHOD.get, REQRES.usersPage(page), {
    baseUrl: REQRES.baseUrl,
    headers,
  });
}

/**
 * Collects the items of all pages into one array.
 * @param {import('@playwright/test').APIRequestContext} request - Playwright request context.
 * @returns {Promise<{items: object[], total: number, pages: number}>} All items,
 * the total and the number of pages reported by the API.
 * @throws {NetworkError} If any page does not return 200.
 */
async function fetchAllUsers(request) {
  const items = [];
  let page = REQRES.firstPage;
  let totalPages = REQRES.firstPage;
  let total = 0;
  while (page <= totalPages) {
    const response = await fetchUsersPage(request, page);
    if (response.status !== API_STATUS.ok) {
      throw new NetworkError(`ReqRes page ${page} failed`, response.status);
    }
    items.push(...response.body.data);
    ({ total_pages: totalPages, total } = response.body);
    page += 1;
  }
  return { items, total, pages: totalPages };
}

module.exports = { fetchUsersPage, fetchAllUsers };
