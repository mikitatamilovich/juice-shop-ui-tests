const { test } = require('@playwright/test');
const { FINDING_ANNOTATION } = require('../../config/api.constants');

/**
 * Adds a "finding" annotation to the running test, so it appears in the HTML report.
 * @param {string} description - What was observed.
 * @returns {void}
 */
function recordFinding(description) {
  test.info().annotations.push({ type: FINDING_ANNOTATION, description });
}

module.exports = { recordFinding };
