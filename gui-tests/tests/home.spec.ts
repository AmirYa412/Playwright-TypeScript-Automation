import {test} from '@playwright/test';
import SchedulerHomePage from '../pages/home';

test.describe('Test Scheduler Home Page', () => {
        let schedulerHomePage: SchedulerHomePage;

        test.beforeEach(async ({page}) => {
            schedulerHomePage = new SchedulerHomePage(page);
            await schedulerHomePage.navigatePage();
        });

        test('Switch to infinite scroll page', async () => {
            await schedulerHomePage.verifyHeaderTextContains('Basic example(</>View example source code)');
            await schedulerHomePage.switchToInfiniteScroll();
            await schedulerHomePage.verifyHeaderTextContains('Infinite scroll(</>View example source code)');
            await schedulerHomePage.verifyUrlContains('/infinitescroll');
        });
    }
)