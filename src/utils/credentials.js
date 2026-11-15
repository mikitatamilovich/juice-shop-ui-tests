const { EMAIL_KIND, SQL_INJECTION_EMAIL } = require('../../config/api.constants');
const { EMPTY_VALUE } = require('../../config/constants');
const { buildUniqueEmail } = require('./api');

/**
 * Picks the email to send for a data set of the login test.
 * @param {string} emailKind - One of the EMAIL_KIND values.
 * @param {{email: string}} user - Registered user.
 * @returns {string} Email to send.
 */
function resolveEmail(emailKind, user) {
  switch (emailKind) {
    case EMAIL_KIND.registered:
      return user.email;
    case EMAIL_KIND.unknown:
      return buildUniqueEmail();
    case EMAIL_KIND.injection:
      return SQL_INJECTION_EMAIL;
    default:
      return EMPTY_VALUE;
  }
}

module.exports = { resolveEmail };
