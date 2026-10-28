const crypto = require('node:crypto');
const { TASK_DEFAULTS, TASK_TITLE_PREFIX } = require('../../config/stand.constants');

/**
 * Builds task data with a unique title, so parallel tests never collide.
 * Values that matter for a scenario are passed explicitly through overrides.
 * @param {object} [overrides] - Fields that replace the defaults.
 * @returns {object} Task body for POST /api/tasks.
 */
function buildTask(overrides = {}) {
  return {
    title: `${TASK_TITLE_PREFIX}${crypto.randomUUID()}`,
    ...TASK_DEFAULTS,
    ...overrides,
  };
}

module.exports = { buildTask };
