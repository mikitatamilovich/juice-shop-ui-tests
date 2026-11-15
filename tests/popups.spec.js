const { test } = require('@playwright/test');
const { ROUTES } = require('../config/constants');
const { acceptCookies, dismissWelcomeBanner } = require('../src/utils/auth');
const {
  expectAppNameShown,
  expectCookieBannerHidden,
  expectHomeButtonVisible,
  expectWelcomeBannerHidden,
} = require('../src/utils/asserts');

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.home);
  await dismissWelcomeBanner(page);
  await acceptCookies(page);
});

test('should show app name after popups are dismissed', async ({ page }) => {
  await expectHomeButtonVisible(page);
  await expectAppNameShown(page);
});

test('should not show popups again after reload', async ({ page }) => {
  await page.reload();
  await expectHomeButtonVisible(page);
  await expectWelcomeBannerHidden(page);
  await expectCookieBannerHidden(page);
});
