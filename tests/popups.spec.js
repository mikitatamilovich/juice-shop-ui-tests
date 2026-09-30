const { test, expect } = require('@playwright/test');
const { ROUTES, UI_TEXT } = require('../config/constants');
const { dismissPopups } = require('../src/utils/auth');
const { expectPopupsHidden } = require('../src/utils/asserts');

test('should dismiss popups and show app heading', async ({ page }) => {
  await page.goto(ROUTES.home);
  await dismissPopups(page);
  const homeButton = page.getByRole('button', { name: UI_TEXT.homeButton });
  await expect(homeButton).toBeVisible();
  await expect(homeButton).toContainText(UI_TEXT.appHeading);
});

test('should not show popups again after reload', async ({ page }) => {
  await page.goto(ROUTES.home);
  await dismissPopups(page);
  await page.reload();
  await expectPopupsHidden(page);
});
