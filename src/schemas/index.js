const Ajv = require('ajv');

const ajv = new Ajv({ allErrors: true });

/** JSON Schema of the POST /rest/user/login response. */
const loginResponseSchema = {
  type: 'object',
  properties: {
    authentication: {
      type: 'object',
      properties: {
        token: { type: 'string' },
        bid: { type: 'number' },
        umail: { type: 'string' },
      },
      required: ['token', 'bid', 'umail'],
    },
  },
  required: ['authentication'],
};

/** JSON Schema of the GET /rest/products/search response. */
const searchResponseSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: { id: { type: 'number' }, name: { type: 'string' } },
        required: ['id', 'name'],
      },
    },
  },
  required: ['data'],
};

/** JSON Schema of the GET /rest/basket/:id response. */
const basketSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: { id: { type: 'number' }, Products: { type: 'array' } },
      required: ['id', 'Products'],
    },
  },
  required: ['data'],
};

/** JSON Schema of the basket item returned by POST /api/BasketItems. */
const basketItemSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    ProductId: { type: 'number' },
    BasketId: { type: 'number' },
    quantity: { type: 'number' },
  },
  required: ['id', 'ProductId', 'BasketId', 'quantity'],
};

/** Compiled validator for the login response. */
const validateLoginResponse = ajv.compile(loginResponseSchema);

/** Compiled validator for the search response. */
const validateSearchResponse = ajv.compile(searchResponseSchema);

/** Compiled validator for the basket response. */
const validateBasket = ajv.compile(basketSchema);

/** Compiled validator for the basket item. */
const validateBasketItem = ajv.compile(basketItemSchema);

/**
 * Formats the errors of the last validation run, to use as an assertion message.
 * @param {import('ajv').ValidateFunction} validate - Validator that has just been called.
 * @returns {string} Errors as JSON text.
 */
function formatSchemaErrors(validate) {
  return JSON.stringify(validate.errors);
}

module.exports = {
  validateLoginResponse,
  validateSearchResponse,
  validateBasket,
  validateBasketItem,
  formatSchemaErrors,
};
