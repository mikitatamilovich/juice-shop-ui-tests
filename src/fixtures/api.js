const base = require('@playwright/test');
const { createAccount } = require('../api/accounts');
const { deleteBasketItem } = require('../api/basket');
const { createTestUser } = require('../utils/api');

/** Test with API fixtures: a registered user, logged in accounts and a basket cleanup list. */
const test = base.test.extend({
  /** Registered user without a session. */
  user: async ({ request }, use) => {
    await use(await createTestUser(request));
  },
  /** Registered and logged in account with its basket id. */
  account: async ({ request }, use) => {
    await use(await createAccount(request));
  },
  /** Second account, used for the authorization checks. */
  otherAccount: async ({ request }, use) => {
    await use(await createAccount(request));
  },
  /** Basket item ids created by a test. Items are deleted after the test, even if it failed. */
  basketCleanup: async ({ request, account }, use) => {
    const itemIds = [];
    await use(itemIds);
    for (const itemId of itemIds.filter(Boolean)) {
      await deleteBasketItem(request, account.token, itemId);
    }
  },
});

module.exports = { test };
