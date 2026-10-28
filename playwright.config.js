const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config({ quiet: true });
const { BASE_URL, TIMEOUTS } = require('./config/constants');

const isCI = Boolean(process.env.CI);
const STAND_API_URL = process.env.STAND_API_URL || 'http://localhost:4000';

module.exports = defineConfig({
  timeout: TIMEOUTS.test,
  expect: { timeout: TIMEOUTS.expect },
  fullyParallel: true,
  workers: isCI ? 2 : undefined,
  forbidOnly: isCI,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: BASE_URL,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      testMatch: '**/*.spec.js',
      use: { baseURL: BASE_URL },
    },
    {
      name: 'stand',
      testDir: './tests/stand',
      use: { baseURL: STAND_API_URL },
    },
  ],
});
