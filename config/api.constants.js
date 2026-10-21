/** API endpoints used by the API tests. */
const API_ENDPOINTS = {
  login: '/rest/user/login',
  users: '/api/Users',
  basketItems: '/api/BasketItems',
  search: (query) => `/rest/products/search?q=${encodeURIComponent(query)}`,
  basket: (basketId) => `/rest/basket/${basketId}`,
  basketItem: (itemId) => `/api/BasketItems/${itemId}`,
};

/** HTTP methods used by the API client. */
const HTTP_METHOD = { get: 'GET', post: 'POST', delete: 'DELETE' };

/** HTTP status codes used in API checks. */
const API_STATUS = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
};

/** HTTP header names and values. */
const HEADERS = {
  authorization: 'Authorization',
  bearerPrefix: 'Bearer ',
};

/** Kinds of email used by the data-driven login test. */
const EMAIL_KIND = {
  registered: 'registered',
  unknown: 'unknown',
  empty: 'empty',
  injection: 'injection',
};

/** Email with an SQL injection payload. */
const SQL_INJECTION_EMAIL = "' OR 1=1--";

/** Basket scenario data. */
const BASKET_ITEM = {
  nonExistingProductId: 999999,
  nonExistingItemId: 999999,
  quantityOne: 1,
  zeroQuantity: 0,
  negativeQuantity: -1,
};

/** Field of the token payload that must not contain the password. */
const PASSWORD_FIELD = 'password';

/** Tag of the tests that fail because of a known defect of the application. */
const KNOWN_DEFECT_TAG = '@known-defect';

/**
 * Builds the test details for a known defect: the tag and the description shown in the report.
 * The test itself keeps asserting the correct behavior.
 * @param {string} description - What is wrong in the application.
 * @returns {{tag: string, annotation: {type: string, description: string}}} Playwright test details.
 */
function knownDefect(description) {
  return { tag: KNOWN_DEFECT_TAG, annotation: { type: 'known-defect', description } };
}

/** Test details for the tests that currently fail because of defects of Juice Shop. */
const KNOWN_DEFECT = {
  sqlInjectionLogin: knownDefect('Login is vulnerable to SQL injection and returns 200'),
  passwordHashInToken: knownDefect('JWT payload contains the password hash'),
  foreignBasketRead: knownDefect('A user can read the basket of another user (200)'),
  nonExistingProduct: knownDefect('Adding a non-existing product returns 500'),
  negativeQuantity: knownDefect('Negative quantity is accepted (200)'),
  zeroQuantity: knownDefect('Zero quantity is accepted (200)'),
};

/** ReqRes service used for the pagination checks. */
const REQRES = {
  baseUrl: process.env.REQRES_BASE_URL || 'https://reqres.in',
  apiKey: process.env.REQRES_API_KEY,
  apiKeyHeader: 'x-api-key',
  usersPage: (page) => `/api/users?page=${page}`,
  firstPage: 1,
};

module.exports = {
  API_ENDPOINTS,
  HTTP_METHOD,
  API_STATUS,
  HEADERS,
  EMAIL_KIND,
  SQL_INJECTION_EMAIL,
  BASKET_ITEM,
  PASSWORD_FIELD,
  KNOWN_DEFECT,
  REQRES,
};
