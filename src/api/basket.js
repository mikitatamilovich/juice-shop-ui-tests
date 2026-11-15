const { API_ENDPOINTS, HTTP_METHOD } = require('../../config/api.constants');
const { sendRequest } = require('./http');

/**
 * Builds the request body for adding a product to a basket.
 * @param {number} basketId - Basket id.
 * @param {number} productId - Product id.
 * @param {number} quantity - Quantity to add.
 * @returns {{ProductId: number, BasketId: number, quantity: number}} Basket item data.
 */
function buildBasketItem(basketId, productId, quantity) {
  return { ProductId: productId, BasketId: basketId, quantity };
}

/**
 * Gets a basket by id. Pass no token to check unauthorized access.
 * @param {import('@playwright/test').APIRequestContext} request - Playwright request context.
 * @param {string|undefined} token - JWT token.
 * @param {number} basketId - Basket id.
 * @returns {Promise<{status: number, body: any}>} Raw response.
 */
function getBasket(request, token, basketId) {
  return sendRequest(request, HTTP_METHOD.get, API_ENDPOINTS.basket(basketId), { token });
}

/**
 * Adds a product to a basket.
 * @param {import('@playwright/test').APIRequestContext} request - Playwright request context.
 * @param {string|undefined} token - JWT token.
 * @param {{ProductId: number, BasketId: number, quantity: number}} item - Basket item data.
 * @returns {Promise<{status: number, body: any}>} Raw response.
 */
function addToBasket(request, token, item) {
  return sendRequest(request, HTTP_METHOD.post, API_ENDPOINTS.basketItems, {
    token,
    body: item,
  });
}

/**
 * Deletes a basket item. Pass no token to check unauthorized access.
 * @param {import('@playwright/test').APIRequestContext} request - Playwright request context.
 * @param {string|undefined} token - JWT token.
 * @param {number} itemId - Basket item id.
 * @returns {Promise<{status: number, body: any}>} Raw response.
 */
function deleteBasketItem(request, token, itemId) {
  return sendRequest(request, HTTP_METHOD.delete, API_ENDPOINTS.basketItem(itemId), { token });
}

module.exports = { buildBasketItem, getBasket, addToBasket, deleteBasketItem };
