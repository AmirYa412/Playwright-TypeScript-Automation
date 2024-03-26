import {defineConfig} from '@playwright/test';
import {config} from 'dotenv';

config();

if (!process.env.PROTOCOL || !process.env.API_BASE_URL) {
    throw new Error("Environment variables are not set for this project! Please read the README.md file.");
}

export default defineConfig({
    testDir: './tests',
    timeout: 10 * 1000,
    expect: {
        // Timeouts for the expect() assertions.
        timeout: 3000
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'off',
        headless: true // Just in case browser will open
    },

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://127.0.0.1:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});
