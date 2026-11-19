import { defineConfig, devices } from '@playwright/test';

// Which version of the demo to test: "fixed" (default) or "broken".
const SITE = process.env.SITE || 'fixed';

export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:3000/${SITE}/`,
    actionTimeout: 5000, // fail fast when an agent-style lookup can't find a control
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:3000/fixed/',
    reuseExistingServer: !process.env.CI,
  },
});
