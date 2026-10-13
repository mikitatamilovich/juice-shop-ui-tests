const { EMAIL_KIND } = require('../../config/api.constants');
const { EMPTY_VALUE } = require('../../config/constants');
const { buildUniqueEmail } = require('./api');

/**
 * Picks the email to send for a data set of the login test.
 * @param {string} emailKind - One of the EMAIL_KIND values.
 * @param {{email: string}} user - Registered user.
 * @returns {string} Email to send.
 */
function resolveEmail(emailKind, user) {
  if (emailKind === EMAIL_KIND.registered) {
    return user.email;
  }
  return emailKind === EMAIL_KIND.unknown ? buildUniqueEmail() : EMPTY_VALUE;
}

module.exports = { resolveEmail };
