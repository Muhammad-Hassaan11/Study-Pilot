import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', fullyParallel: false,
  timeout: 90000,
  use: { baseURL: 'http://localhost:3000', channel: 'chrome', trace: 'retain-on-failure' },
  webServer: { command: 'npm.cmd run dev -- --webpack', url: 'http://localhost:3000', reuseExistingServer: false, timeout: 120000, env: { STUDYPILOT_DB_PATH: '.data/browser-tests.sqlite' } },
});
