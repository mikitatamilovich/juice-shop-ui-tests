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
  dismissPopups,
  fillLoginForm,
  openAccountMenu,
  openLoginForm,
  submitLoginForm,
  togglePasswordVisibility,
  waitForLoginRedirect,
} = require('../src/utils/auth');
const {
  expectEmptyEmailBlocked,
  expectInvalidLogin,
  expectLoggedIn,
  expectLoginDisabled,
  expectPasswordInputType,
} = require('../src/utils/asserts');

const LOGIN_CASES = [
  {
    title: 'valid credentials',
    getEmail: (user) => user.email,
    password: TEST_USER_PASSWORD,
    shouldSubmit: true,
    verify: async (page, user) => {
      await waitForLoginRedirect(page);
      await openAccountMenu(page);
      await expectLoggedIn(page, user.email);
    },
  },
  {
    title: 'wrong password',
    getEmail: (user) => user.email,
    password: WRONG_PASSWORD,
    shouldSubmit: true,
    verify: (page) => expectInvalidLogin(page),
  },
  {
    title: 'non-existing email',
    getEmail: () => buildUniqueEmail(),
    password: TEST_USER_PASSWORD,
    shouldSubmit: true,
    verify: (page) => expectInvalidLogin(page),
  },
  {
    title: 'empty email',
    getEmail: () => EMPTY_VALUE,
    password: TEST_USER_PASSWORD,
    shouldSubmit: false,
    verify: (page) => expectEmptyEmailBlocked(page),
  },
];

test.beforeEach(async ({ page }) => {
  await page.goto(ROUTES.home);
  await dismissPopups(page);
});

for (const { title, getEmail, password, shouldSubmit, verify } of LOGIN_CASES) {
  test(`should handle login: ${title}`, async ({ page, request }) => {
    const user = await createTestUser(request);
    await openLoginForm(page);
    await fillLoginForm(page, getEmail(user), password);
    if (shouldSubmit) {
      await submitLoginForm(page);
    }
    await verify(page, user);
  });
}

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
  await togglePasswordVisibility(page);
  await expectPasswordInputType(page, INPUT_TYPE.visible);
});
