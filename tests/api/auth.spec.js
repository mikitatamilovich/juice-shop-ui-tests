const { expect } = require('@playwright/test');
const { test } = require('../../src/fixtures/api');
const { login, requestLogin } = require('../../src/api/auth');
const { formatSchemaErrors, validateLoginResponse } = require('../../src/schemas');
const { resolveEmail } = require('../../src/utils/credentials');
const { decodeJwtPayload } = require('../../src/utils/jwt');
const {
  API_STATUS,
  EMAIL_KIND,
  KNOWN_DEFECT,
  PASSWORD_FIELD,
} = require('../../config/api.constants');
const {
  EMPTY_VALUE,
  MESSAGES,
  TEST_USER_PASSWORD,
  WRONG_PASSWORD,
} = require('../../config/constants');

/**
 * Data sets for the data-driven negative login test. Every one must be rejected with 401.
 * Optional details mark the sets that fail because of a known defect.
 */
const NEGATIVE_LOGIN_CASES = [
  { title: 'wrong password', emailKind: EMAIL_KIND.registered, password: WRONG_PASSWORD },
  { title: 'non-existing email', emailKind: EMAIL_KIND.unknown, password: TEST_USER_PASSWORD },
  { title: 'empty email', emailKind: EMAIL_KIND.empty, password: TEST_USER_PASSWORD },
  { title: 'empty password', emailKind: EMAIL_KIND.registered, password: EMPTY_VALUE },
  {
    title: 'SQL injection in email',
    emailKind: EMAIL_KIND.injection,
    password: TEST_USER_PASSWORD,
    details: KNOWN_DEFECT.sqlInjectionLogin,
  },
];

for (const { title, emailKind, password, details = {} } of NEGATIVE_LOGIN_CASES) {
  test(`should return 401 for login with ${title}`, details, async ({ request, user }) => {
    const response = await requestLogin(request, resolveEmail(emailKind, user), password);

    expect(response.status).toBe(API_STATUS.unauthorized);
    expect(response.body).toContain(MESSAGES.invalidLogin);
    expect(response.body?.authentication?.token).toBeUndefined();
  });
}

test('should return 200 with token, basket id and email for valid credentials', async ({
  request,
  user,
}) => {
  const response = await requestLogin(request, user.email, user.password);

  expect(response.status).toBe(API_STATUS.ok);
  expect(validateLoginResponse(response.body), formatSchemaErrors(validateLoginResponse)).toBe(
    true,
  );
  expect(response.body.authentication.umail).toBe(user.email);
});

test(
  'should include only safe user data in the token payload',
  KNOWN_DEFECT.passwordHashInToken,
  async ({ request, user }) => {
    const token = await login(request, user.email, user.password);
    const payload = decodeJwtPayload(token);

    expect(payload.data.email).toBe(user.email);
    expect(payload.data, 'Token payload must not contain the password hash').not.toHaveProperty(
      PASSWORD_FIELD,
    );
  },
);
