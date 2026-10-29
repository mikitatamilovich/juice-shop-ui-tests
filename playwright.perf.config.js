const { defineConfig } = require('@playwright/test');
require('dotenv').config({ quiet: true });
const { STAND, PERF_TEST_TIMEOUT_MS } = require('./config/stand.constants');

// Separate config: the experiment is not part of the regular test runs.
module.exports = defineConfig({
  testDir: './tests/performance',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: PERF_TEST_TIMEOUT_MS,
  reporter: [['list']],
  use: { baseURL: STAND.apiUrl },
});
