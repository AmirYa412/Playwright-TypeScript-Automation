import {Page, Locator} from 'playwright';
import {expect} from '@playwright/test';
import BasePage from './base-page';


class SchedulerHomePage extends BasePage {
    protected readonly path: string = '/scheduler/#/';
    private readonly infiniteScrollButton: Locator;
    private readonly headerText: Locator;

    constructor(page: Page) {
        super(page);
        this.infiniteScrollButton = this.getLocator('a[href="#/infinitescroll"]');
        this.headerText = this.getLocator('h3[style="text-align: center;"]');
    }

    public async navigatePage(): Promise<void> {
        await this.navigate(this.path);
    }

    public async switchToInfiniteScroll(): Promise<void> {
        await this.clickOnElement(this.infiniteScrollButton);
    }

    public async verifyHeaderTextContains(expectedText: string): Promise<void> {
        const headerText = await this.getElementText(this.headerText);
        expect(headerText).toContain(expectedText);
    }
}

export default SchedulerHomePage;
