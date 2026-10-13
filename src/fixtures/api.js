const base = require('@playwright/test');
const { createAccount } = require('../api/accounts');
const { createTestUser } = require('../api/users');

/** Test with API fixtures: a registered user, logged in accounts and a basket cleanup list. */
const test = base.test.extend({
  /** Registered user without a session. */
  // eslint-disable-next-line no-empty-pattern -- Playwright requires a destructured first argument
  user: async ({}, use) => {
    await use(await createTestUser());
  },
  /** Registered and logged in account with its basket id. */
  // eslint-disable-next-line no-empty-pattern -- Playwright requires a destructured first argument
  account: async ({}, use) => {
    await use(await createAccount());
  },
  /** Second account, used for the authorization checks. */
  // eslint-disable-next-line no-empty-pattern -- Playwright requires a destructured first argument
  otherAccount: async ({}, use) => {
    await use(await createAccount());
  },
  /** List of basket item ids created by a test; the afterEach hook deletes them. */
  // eslint-disable-next-line no-empty-pattern -- Playwright requires a destructured first argument
  basketCleanup: async ({}, use) => {
    await use([]);
  },
});

module.exports = { test };
