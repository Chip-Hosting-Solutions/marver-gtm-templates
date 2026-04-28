import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: /.*\.spec\.ts/,
  use: {
    headless: true,
    baseURL: 'http://localhost:8765',
  },
  webServer: {
    command: 'npx http-server e2e -p 8765 -c-1 --silent',
    port: 8765,
    reuseExistingServer: !process.env.CI,
  },
});
