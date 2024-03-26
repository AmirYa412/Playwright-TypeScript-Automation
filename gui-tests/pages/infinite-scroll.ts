import {Page, Locator} from 'playwright';
import {expect} from '@playwright/test';
import BasePage from './base-page';


class InfiniteScrollPage extends BasePage {
    protected readonly path: string = '/scheduler/#/infinitescroll';
    private readonly viewButtons: Locator;
    private readonly viewButtonsIndex: object = {day: 0, month: 1};
    private readonly dateLabel: Locator;
    private readonly allEvents: Locator;
    private readonly schedulerResources: Locator;
    private readonly resourcesCells: string = 'td[style*="width"]';
    private readonly rightArrowButton: Locator;
    private readonly leftArrowButton: Locator;


    constructor(page: Page) {
        super(page);
        this.viewButtons = this.getLocator('.ant-radio-button-wrapper');
        this.dateLabel = this.getLocator('.header2-text-label');
        this.allEvents = this.getLocator('a.timeline-event');
        this.schedulerResources = this.getLocator('.scheduler-bg > table > tbody > tr[style*="height"]');
        this.rightArrowButton = this.getLocator('svg[data-icon="right"]');
        this.leftArrowButton = this.getLocator('svg[data-icon="right"]');
    }


    public async navigatePage(): Promise<void> {
        await this.navigate(this.path);
    }

    public async switchToView(viewType: string): Promise<void> {
        const buttonIndex = this.viewButtonsIndex[viewType];
        await this.clickOnElement(this.viewButtons.nth(buttonIndex));
    }

    public async addNewEvent(resourceIndex: number, cellIndex: number): Promise<void> {
        // Get resource's cells by index
        const resource = this.schedulerResources.nth(resourceIndex);
        // Cells 8 to 29 are usually visible
        const cell = resource.locator(this.resourcesCells).nth(cellIndex);
        await this.handleDialogs(true)
        // Using force click to avoid element click intercepted error
        await this.clickOnElement(cell, true);
    }

    public async moveMonth(action: string, count: number): Promise<void> {
        const actionsMap = {
            forward: this.rightArrowButton,
            backward: this.leftArrowButton
        }
        for (let i = 0; i < count; i++) {
            await this.clickOnElement(actionsMap[action]);
        }
    }

    public async getAllVisibleEventsCount(): Promise<number> {
        return this.allEvents.count();
    }

    public async verifyViewButtonIsSelected(view: string): Promise<void> {
        const selectedButton = this.viewButtons.nth(this.viewButtonsIndex[view]);
        const classAttribute = await selectedButton.getAttribute('class');
        expect(classAttribute).toContain('ant-radio-button-wrapper-checked');

        // Verify the other button is not selected
        const otherView = view === 'day' ? 'month' : 'day';
        const otherButton = this.viewButtons.nth(this.viewButtonsIndex[otherView]);
        const otherClassAttribute = await otherButton.getAttribute('class');
        expect(otherClassAttribute).not.toContain('ant-radio-button-wrapper-checked');
    }

    public async verifyDateLabelFormat(view: string): Promise<void> {
        const formatMap = {
            day: {year: 'numeric', month: 'short', day: 'numeric'},
            month: {year: 'numeric', month: 'short'}
        }
        const dateText = await this.dateLabel.textContent();
        const date = new Date(dateText);
        const expectedFormat = date.toLocaleDateString('en-US', formatMap[view]);
        expect(dateText).toBe(expectedFormat);
    }
}

export default InfiniteScrollPage;
