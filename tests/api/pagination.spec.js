const { expect, test } = require('@playwright/test');
const { fetchAllUsers } = require('../../src/api/reqres');
const { REQRES } = require('../../config/api.constants');

test.describe.configure({ mode: 'serial' });

let collected;

test.beforeAll(async () => {
  collected = await fetchAllUsers();
});

test('should collect all users across pages and match total', async () => {
  expect(collected.items.length).toBe(collected.total);
});

test('should not repeat user ids across pages', async () => {
  const ids = collected.items.map((user) => user.id);
  expect(new Set(ids).size).toBe(ids.length);
});

test('should read more than one page', async () => {
  expect(collected.pages).toBeGreaterThan(REQRES.firstPage);
});
