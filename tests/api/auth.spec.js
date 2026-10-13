const { expect } = require('@playwright/test');
const { test } = require('../../src/fixtures/api');
const { login, requestLogin } = require('../../src/api/auth');
const { formatSchemaErrors, validateLoginResponse } = require('../../src/schemas');
const { resolveEmail } = require('../../src/utils/credentials');
const { recordFinding } = require('../../src/utils/findings');
const { decodeJwtPayload } = require('../../src/utils/jwt');
const {
  API_STATUS,
  EMAIL_KIND,
  OBSERVED_STATUS,
  PASSWORD_FIELD,
} = require('../../config/api.constants');
const { EMPTY_VALUE, TEST_USER_PASSWORD, WRONG_PASSWORD } = require('../../config/constants');

/** Data sets for the data-driven login test. */
const LOGIN_CASES = [
  {
    title: 'valid credentials',
    emailKind: EMAIL_KIND.registered,
    password: TEST_USER_PASSWORD,
    status: API_STATUS.ok,
    hasToken: true,
  },
  {
    title: 'wrong password',
    emailKind: EMAIL_KIND.registered,
    password: WRONG_PASSWORD,
    status: API_STATUS.unauthorized,
    hasToken: false,
  },
  {
    title: 'non-existing email',
    emailKind: EMAIL_KIND.unknown,
    password: TEST_USER_PASSWORD,
    status: API_STATUS.unauthorized,
    hasToken: false,
  },
  {
    title: 'empty email',
    emailKind: EMAIL_KIND.empty,
    password: TEST_USER_PASSWORD,
    status: OBSERVED_STATUS.emptyEmailLogin,
    hasToken: false,
  },
  {
    title: 'empty password',
    emailKind: EMAIL_KIND.registered,
    password: EMPTY_VALUE,
    status: OBSERVED_STATUS.emptyPasswordLogin,
    hasToken: false,
  },
];

for (const { title, emailKind, password, status, hasToken } of LOGIN_CASES) {
  test(`should return ${status} for login with ${title}`, async ({ user }) => {
    const response = await requestLogin(resolveEmail(emailKind, user), password);
    expect(response.status).toBe(status);
    expect(Boolean(response.body?.authentication?.token)).toBe(hasToken);
  });
}

test('should return token, basket id and email for valid credentials', async ({ user }) => {
  const response = await requestLogin(user.email, user.password);
  expect(validateLoginResponse(response.body), formatSchemaErrors(validateLoginResponse)).toBe(
    true,
  );
  expect(response.body.authentication.umail).toBe(user.email);
});

test('should include user email in the token payload', async ({ user }) => {
  const token = await login(user.email, user.password);
  const payload = decodeJwtPayload(token);
  expect(payload.data.email).toBe(user.email);
  recordFinding(`Token payload exposes the password field: ${PASSWORD_FIELD in payload.data}`);
});
