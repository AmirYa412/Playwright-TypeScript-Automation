import {test, expect} from '@playwright/test';
import InfiniteScrollPage from '../pages/infinite-scroll';

test.describe('Test Infinite Scroll Page', () => {
        let infiniteScrollPage: InfiniteScrollPage;

        test.beforeEach(async ({page}) => {
            infiniteScrollPage = new InfiniteScrollPage(page);
            await infiniteScrollPage.navigatePage();
        });

        test('Switch to month view', async () => {
            await infiniteScrollPage.verifyViewButtonIsSelected('day');
            await infiniteScrollPage.verifyDateLabelFormat('day');

            await infiniteScrollPage.switchToView('month');
            await infiniteScrollPage.verifyViewButtonIsSelected('month');
            await infiniteScrollPage.verifyDateLabelFormat('month');
        });

        test('Add events and check count has increased', async () => {
            await infiniteScrollPage.switchToView('month');
            const initialEventCount = await infiniteScrollPage.getAllVisibleEventsCount();

            await infiniteScrollPage.addNewEvent(6, 20);
            await infiniteScrollPage.addNewEvent(6, 21);
            await infiniteScrollPage.addNewEvent(6, 22);

            const finalEventCount = await infiniteScrollPage.getAllVisibleEventsCount();
            expect(finalEventCount).toBe(initialEventCount + 3);
        });

        test('Event visibility decreases after adding events and advancing a month', async () => {
            await infiniteScrollPage.switchToView('month');

            await infiniteScrollPage.addNewEvent(6, 20);
            await infiniteScrollPage.addNewEvent(6, 21);
            const initialEventCount = await infiniteScrollPage.getAllVisibleEventsCount();

            await infiniteScrollPage.moveMonth('forward', 1);
            const currentMonthEventCount = await infiniteScrollPage.getAllVisibleEventsCount();
            expect(initialEventCount).toBeGreaterThan(currentMonthEventCount);
        });

        test('Added events remain after month transition', async () => {
            await infiniteScrollPage.switchToView('month');

            await infiniteScrollPage.addNewEvent(6, 20);
            await infiniteScrollPage.addNewEvent(6, 21);
            const expectedEventCount = await infiniteScrollPage.getAllVisibleEventsCount();

            await infiniteScrollPage.moveMonth('forward', 1);
            await infiniteScrollPage.moveMonth('backward', 1);
            const currentMonthEventCount = await infiniteScrollPage.getAllVisibleEventsCount();
            expect(currentMonthEventCount).toEqual(expectedEventCount);
        });
    }
)