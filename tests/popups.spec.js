const { test } = require('@playwright/test');
const { ROUTES } = require('../config/constants');
const { dismissPopups } = require('../src/utils/auth');
const { expectAppLoaded, expectPopupsHidden } = require('../src/utils/asserts');

test('should dismiss popups and show app heading', async ({ page }) => {
  await page.goto(ROUTES.home);
  await dismissPopups(page);
  await expectAppLoaded(page);
});

test('should not show popups again after reload', async ({ page }) => {
  await page.goto(ROUTES.home);
  await dismissPopups(page);
  await page.reload();
  await expectPopupsHidden(page);
});
