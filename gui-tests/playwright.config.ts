import {defineConfig, devices} from '@playwright/test';
import {config} from 'dotenv';

config();

if (!process.env.PROTOCOL || !process.env.GUI_BASE_URL) {
    throw new Error("Environment variables are not set for this project! Please read the README.md file.");
}

export default defineConfig({
    testDir: './tests',
    timeout: 30 * 1000,
    expect: {
        // Timeouts for the expect() assertions.
        timeout: 5000
    },
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: `${process.env.PROTOCOL}${process.env.GUI_BASE_URL}`,
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'off',
        headless: true,
        screenshot: 'only-on-failure'
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'Google Chrome',
            use: {
                ...devices['Desktop Chrome'],
                viewport: {width: 1920, height: 1080}
            },
        },
        // {
        //   name: 'chromium',
        //   use: { ...devices['Desktop Chrome'] },
        // },
        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },
        //
        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: { ...devices['Pixel 5'] },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: { ...devices['iPhone 12'] },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
        // }
    ]
});
