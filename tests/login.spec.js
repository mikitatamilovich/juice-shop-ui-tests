const { test } = require('@playwright/test');
const {
  EMPTY_VALUE,
  INPUT_TYPE,
  ROUTES,
  TEST_USER_PASSWORD,
  WRONG_PASSWORD,
} = require('../config/constants');
const { buildUniqueEmail, createTestUser } = require('../src/utils/api');
const {
  acceptCookies,
  dismissWelcomeBanner,
  fillEmail,
  fillPassword,
  login,
  openAccountMenu,
  openLoginForm,
  submitLoginForm,
  togglePasswordVisibility,
} = require('../src/utils/auth');
const {
  expectEmptyEmailError,
  expectInvalidLogin,
  expectLoggedIn,
  expectLoginDisabled,
  expectPasswordInputType,
} = require('../src/utils/asserts');

/** Credentials that must be rejected by the application. */
const INVALID_LOGIN_CASES = [
  { title: 'wrong password', useRegisteredEmail: true, password: WRONG_PASSWORD },
  { title: 'non-existing email', useRegisteredEmail: false, password: TEST_USER_PASSWORD },
];

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.home);
  await dismissWelcomeBanner(page);
  await acceptCookies(page);
});

test('should log in with valid credentials', async ({ page, request }) => {
  const user = await createTestUser(request);
  await login(page, user.email, user.password);
  await openAccountMenu(page);
  await expectLoggedIn(page, user.email);
});

for (const { title, useRegisteredEmail, password } of INVALID_LOGIN_CASES) {
  test(`should show error for ${title}`, async ({ page, request }) => {
    const user = await createTestUser(request);
    const email = useRegisteredEmail ? user.email : buildUniqueEmail();
    await openLoginForm(page);
    await fillEmail(page, email);
    await fillPassword(page, password);
    await submitLoginForm(page);
    await expectInvalidLogin(page);
  });
}

test('should block login with empty email', async ({ page }) => {
  await openLoginForm(page);
  await fillEmail(page, EMPTY_VALUE);
  await fillPassword(page, TEST_USER_PASSWORD);
  await expectEmptyEmailError(page);
  await expectLoginDisabled(page);
});

test('should block login with empty password', async ({ page, request }) => {
  const user = await createTestUser(request);
  await openLoginForm(page);
  await fillEmail(page, user.email);
  await fillPassword(page, EMPTY_VALUE);
  await expectLoginDisabled(page);
});

test('should mask password and allow showing it', async ({ page }) => {
  await openLoginForm(page);
  await fillPassword(page, TEST_USER_PASSWORD);
  await expectPasswordInputType(page, INPUT_TYPE.hidden);
  await togglePasswordVisibility(page);
  await expectPasswordInputType(page, INPUT_TYPE.visible);
});
