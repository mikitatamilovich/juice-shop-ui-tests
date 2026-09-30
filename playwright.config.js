const { defineConfig, devices } = require('@playwright/test');
const { BASE_URL } = require('./config/constants');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
