const { defineConfig, devices } = require('@playwright/test');
const { BASE_URL, TIMEOUTS } = require('./config/constants');

module.exports = defineConfig({
  testDir: './tests',
  timeout: TIMEOUTS.test,
  expect: { timeout: TIMEOUTS.expect },
  fullyParallel: true,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
