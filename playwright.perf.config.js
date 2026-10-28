const { defineConfig } = require('@playwright/test');
require('dotenv').config({ quiet: true });

// Separate config: the experiment is not part of the regular test runs.
module.exports = defineConfig({
  testDir: './tests/performance',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 180_000,
  reporter: [['list']],
  use: { baseURL: process.env.STAND_API_URL || 'http://localhost:4000' },
});
