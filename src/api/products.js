const { API_ENDPOINTS, HTTP_METHOD } = require('../../config/api.constants');
const { sendRequest } = require('./http');

/**
 * Searches products by query.
 * @param {import('@playwright/test').APIRequestContext} request - Playwright request context.
 * @param {string} query - Search text (may be empty).
 * @returns {Promise<{status: number, body: any}>} Raw response.
 */
function searchProducts(request, query) {
  return sendRequest(request, HTTP_METHOD.get, API_ENDPOINTS.search(query));
}

/**
 * Finds the id of the product with exactly the given name.
 * Exact comparison keeps "Apple Juice" from matching "Pineapple Juice".
 * @param {import('@playwright/test').APIRequestContext} request - Playwright request context.
 * @param {string} name - Product name.
 * @returns {Promise<number>} Product id.
 * @throws {Error} If the product is not found.
 */
async function findProductIdByName(request, name) {
  const response = await searchProducts(request, name);
  const product = response.body.data.find((item) => item.name === name);
  if (!product) {
    throw new Error(`Product "${name}" was not found in search results`);
  }
  return product.id;
}

module.exports = { searchProducts, findProductIdByName };
