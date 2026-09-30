const { test, expect } = require('@playwright/test');
const { ROUTES, UI_TEXT } = require('../config/constants');
const { dismissPopups } = require('../src/utils/auth');

test('should dismiss popups and show app heading', async ({ page }) => {
  await page.goto(ROUTES.home);
  await dismissPopups(page);
  await expect(page.getByRole('button', { name: UI_TEXT.homeButton })).toBeVisible();
});
