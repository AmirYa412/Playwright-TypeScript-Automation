import {Page, Locator, Dialog} from 'playwright';
import {expect} from '@playwright/test';

class BasePage {
    protected readonly page: Page;
    private dialogHandler: (dialog: Dialog) => Promise<void>;


    constructor(page: Page) {
        this.page = page;
    }

    public async navigate(path: string): Promise<void> {
        await this.page.goto(path);
    }

    public getLocator(locator: string): Locator {
        // locator can return multiple elements
        return this.page.locator(locator);
    }

    public async getElementText(element: Locator) : Promise<string> {
        return await element.textContent();
    }

    public async clickOnElement(element: Locator, useForce: boolean = false, timeout: number = 3000): Promise<void> {
        await element.waitFor({state: 'visible', timeout: timeout});
        await element.click({force: useForce});
    }

    public async handleDialogs(accept: boolean): Promise<void> {
        if (this.dialogHandler) {
            this.page.off('dialog', this.dialogHandler);
        }
        // Set how to handle dialogs
        // dialog is built-in Playwright object
        this.dialogHandler = accept ?
            async dialog => {
                await dialog.accept();
            } :
            async dialog => {
                await dialog.dismiss();
            };

        this.page.on('dialog', this.dialogHandler);
    }

    public async verifyUrlContains(expectedPath: string): Promise<void> {
        expect(this.page.url()).toContain(expectedPath);
    }
}

export default BasePage;
