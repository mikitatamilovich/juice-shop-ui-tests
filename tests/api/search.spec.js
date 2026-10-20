const { expect } = require('@playwright/test');
const { test } = require('../../src/fixtures/api');
const { searchProducts } = require('../../src/api/products');
const { formatSchemaErrors, validateSearchResponse } = require('../../src/schemas');
const { API_STATUS } = require('../../config/api.constants');
const { EMPTY_VALUE, PRODUCT_NAME, SEARCH } = require('../../config/constants');

test('should return matching products for existing query', async ({ request }) => {
  const response = await searchProducts(request, SEARCH.existingQuery);
  expect(response.status).toBe(API_STATUS.ok);
  expect(validateSearchResponse(response.body), formatSchemaErrors(validateSearchResponse)).toBe(
    true,
  );
  expect(response.body.data.length).toBeGreaterThan(0);
  expect(response.body.data.some((item) => item.name === PRODUCT_NAME)).toBe(true);
});

test('should find product regardless of query case', async ({ request }) => {
  const response = await searchProducts(request, SEARCH.lowerCaseQuery);
  expect(response.status).toBe(API_STATUS.ok);
  expect(response.body.data.some((item) => item.name === PRODUCT_NAME)).toBe(true);
});

test('should return empty list for query without matches', async ({ request }) => {
  const response = await searchProducts(request, SEARCH.missingQuery);
  expect(response.status).toBe(API_STATUS.ok);
  expect(response.body.data).toEqual([]);
});

test('should return empty list for search with special characters', async ({ request }) => {
  const response = await searchProducts(request, SEARCH.specialCharQuery);
  expect(response.status, 'Special characters must not cause a server error').toBe(API_STATUS.ok);
  expect(response.body.data).toEqual([]);
});

test('should return whole catalogue for empty search query', async ({ request }) => {
  const response = await searchProducts(request, EMPTY_VALUE);
  expect(response.status).toBe(API_STATUS.ok);
  expect(response.body.data.length).toBeGreaterThan(0);
});
