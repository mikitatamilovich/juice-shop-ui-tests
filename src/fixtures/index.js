const base = require('@playwright/test');
const { createTestUser } = require('../utils/api');
const { BasePage } = require('../pages/BasePage');
const { BasketPage } = require('../pages/BasketPage');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductsPage');

/** Test with page objects and a fresh API-created user for every test. */
const test = base.test.extend({
  /** Page object with actions shared by all pages. */
  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },
  /** Page object for the account menu and the login form. */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  /** Page object for the product grid and the search bar. */
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  /** Page object for the basket page. */
  basketPage: async ({ page }, use) => {
    await use(new BasketPage(page));
  },
  /** Unique user registered through the API (test data setup only), one per test. */
  testUser: async ({ request }, use) => {
    await use(await createTestUser(request));
  },
});

/**
 * Test that starts every test already logged in: opens the app, closes the popups
 * and logs in through the UI. It is an auto fixture, so it runs before every test
 * even if the test does not request it. Page objects share the same `page`,
 * so no overrides are needed.
 */
const authenticatedTest = test.extend({
  authenticatedPage: [
    async ({ page, basePage, loginPage, testUser }, use) => {
      await basePage.open();
      await basePage.dismissWelcomeBanner();
      await basePage.acceptCookies();
      await loginPage.login(testUser.email, testUser.password);
      await use(page);
    },
    { auto: true },
  ],
});

module.exports = { test, authenticatedTest };
