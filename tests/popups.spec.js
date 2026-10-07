const { test } = require('../src/fixtures');

test.beforeEach(async ({ basePage }) => {
  await basePage.open();
  await basePage.dismissWelcomeBanner();
  await basePage.acceptCookies();
});

test('should show app name after popups are dismissed', async ({ basePage }) => {
  await basePage.expectHomeButtonVisible();
  await basePage.expectAppNameShown();
});

test('should not show popups again after reload', async ({ basePage }) => {
  await basePage.reload();
  await basePage.expectHomeButtonVisible();
  await basePage.expectWelcomeBannerHidden();
  await basePage.expectCookieBannerHidden();
});
