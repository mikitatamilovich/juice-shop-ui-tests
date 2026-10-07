const { test } = require('../src/fixtures');
const {
  EMPTY_VALUE,
  INPUT_TYPE,
  TEST_USER_PASSWORD,
  WRONG_PASSWORD,
} = require('../config/constants');
const { buildUniqueEmail } = require('../src/utils/api');

/** Credentials that must be rejected by the application. */
const INVALID_LOGIN_CASES = [
  { title: 'wrong password', useRegisteredEmail: true, password: WRONG_PASSWORD },
  { title: 'non-existing email', useRegisteredEmail: false, password: TEST_USER_PASSWORD },
];

test.beforeEach(async ({ basePage }) => {
  await basePage.open();
  await basePage.dismissWelcomeBanner();
  await basePage.acceptCookies();
});

test('should log in with valid credentials', async ({ loginPage, testUser }) => {
  await loginPage.login(testUser.email, testUser.password);
  await loginPage.openAccountMenu();
  await loginPage.expectLoggedIn(testUser.email);
});

for (const { title, useRegisteredEmail, password } of INVALID_LOGIN_CASES) {
  test(`should show error for ${title}`, async ({ loginPage, testUser }) => {
    const email = useRegisteredEmail ? testUser.email : buildUniqueEmail();
    await loginPage.openLoginForm();
    await loginPage.fillEmail(email);
    await loginPage.fillPassword(password);
    await loginPage.submit();
    await loginPage.expectInvalidLogin();
  });
}

test('should block login with empty email', async ({ loginPage }) => {
  await loginPage.openLoginForm();
  await loginPage.fillEmail(EMPTY_VALUE);
  await loginPage.fillPassword(TEST_USER_PASSWORD);
  await loginPage.expectEmptyEmailError();
  await loginPage.expectLoginDisabled();
});

test('should block login with empty password', async ({ loginPage, testUser }) => {
  await loginPage.openLoginForm();
  await loginPage.fillEmail(testUser.email);
  await loginPage.fillPassword(EMPTY_VALUE);
  await loginPage.expectLoginDisabled();
});

test('should mask password and allow showing it', async ({ loginPage }) => {
  await loginPage.openLoginForm();
  await loginPage.fillPassword(TEST_USER_PASSWORD);
  await loginPage.expectPasswordInputType(INPUT_TYPE.hidden);
  await loginPage.togglePasswordVisibility();
  await loginPage.expectPasswordInputType(INPUT_TYPE.visible);
});
