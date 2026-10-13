const { expect } = require('@playwright/test');
const { test } = require('../../src/fixtures/api');
const { searchProducts } = require('../../src/api/products');
const { formatSchemaErrors, validateSearchResponse } = require('../../src/schemas');
const { API_STATUS, OBSERVED_STATUS } = require('../../config/api.constants');
const { EMPTY_VALUE, PRODUCT_NAME, SEARCH } = require('../../config/constants');

test('should return matching products for existing query', async () => {
  const response = await searchProducts(SEARCH.existingQuery);
  expect(response.status).toBe(API_STATUS.ok);
  expect(validateSearchResponse(response.body), formatSchemaErrors(validateSearchResponse)).toBe(
    true,
  );
  expect(response.body.data.length).toBeGreaterThan(0);
  expect(response.body.data.some((item) => item.name === PRODUCT_NAME)).toBe(true);
});

test('should return empty list for query without matches', async () => {
  const response = await searchProducts(SEARCH.missingQuery);
  expect(response.status).toBe(API_STATUS.ok);
  expect(response.body.data).toEqual([]);
});

test('should handle empty search query without server error', async () => {
  const response = await searchProducts(EMPTY_VALUE);
  expect(response.status).toBe(OBSERVED_STATUS.emptySearch);
  expect(response.body.data.length).toBeGreaterThan(0);
});
