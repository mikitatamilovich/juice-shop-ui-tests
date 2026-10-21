const { defineConfig, devices } = require('@playwright/test');
const { BASE_URL, TIMEOUTS } = require('./config/constants');

const isCI = Boolean(process.env.CI);

module.exports = defineConfig({
  testDir: './tests',
  timeout: TIMEOUTS.test,
  expect: { timeout: TIMEOUTS.expect },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'ui', testIgnore: '**/api/**', use: { ...devices['Desktop Chrome'] } },
    { name: 'api', testMatch: '**/api/**/*.spec.js' },
  ],
});
