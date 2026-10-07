const { EMPTY_VALUE } = require('../../config/constants');

/**
 * Throws if the value is missing or an empty string.
 * @param {unknown} value - Value to check.
 * @param {string} name - Human readable name used in the error message.
 * @returns {void}
 * @throws {Error} If the value is undefined, null or an empty string.
 */
function requireValue(value, name) {
  if (value === undefined || value === null || value === EMPTY_VALUE) {
    throw new Error(`${name} must be provided`);
  }
}

module.exports = { requireValue };
