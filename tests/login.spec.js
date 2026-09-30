const { test } = require('@playwright/test');
const {
  EMPTY_VALUE,
  INPUT_TYPE,
  ROUTES,
  SELECTORS,
  TEST_USER_PASSWORD,
  WRONG_PASSWORD,
} = require('../config/constants');
const { buildUniqueEmail, createTestUser } = require('../src/utils/api');
const {
  dismissPopups,
  fillLoginForm,
  login,
  openAccountMenu,
  openLoginForm,
  submitLoginForm,
} = require('../src/utils/auth');
const {
  expectEmptyEmailBlocked,
  expectInvalidLogin,
  expectLoggedIn,
  expectLoginDisabled,
  expectPasswordInputType,
} = require('../src/utils/asserts');

const INVALID_LOGIN_CASES = [
  {
    title: 'wrong password',
    getEmail: (user) => user.email,
    password: WRONG_PASSWORD,
  },
  {
    title: 'non-existing email',
    getEmail: () => buildUniqueEmail(),
    password: TEST_USER_PASSWORD,
  },
];

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.home);
  await dismissPopups(page);
});

test('should log in with valid credentials', async ({ page, request }) => {
  const user = await createTestUser(request);
  await login(page, user.email, user.password);
  await openAccountMenu(page);
  await expectLoggedIn(page, user.email);
});

for (const { title, getEmail, password } of INVALID_LOGIN_CASES) {
  test(`should reject login: ${title}`, async ({ page, request }) => {
    const user = await createTestUser(request);
    await openLoginForm(page);
    await fillLoginForm(page, getEmail(user), password);
    await submitLoginForm(page);
    await expectInvalidLogin(page);
  });
}

test('should block login with empty email', async ({ page }) => {
  await openLoginForm(page);
  await fillLoginForm(page, EMPTY_VALUE, TEST_USER_PASSWORD);
  await expectEmptyEmailBlocked(page);
});

test('should block login with empty password', async ({ page, request }) => {
  const user = await createTestUser(request);
  await openLoginForm(page);
  await fillLoginForm(page, user.email, EMPTY_VALUE);
  await expectLoginDisabled(page);
});

test('should mask password and allow showing it', async ({ page }) => {
  await openLoginForm(page);
  await fillLoginForm(page, EMPTY_VALUE, TEST_USER_PASSWORD);
  await expectPasswordInputType(page, INPUT_TYPE.hidden);
  await page.locator(SELECTORS.passwordToggle).click();
  await expectPasswordInputType(page, INPUT_TYPE.visible);
});
