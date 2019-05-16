import {browser, by, element, ElementArrayFinder, ElementFinder, promise as wdpromise, protractor} from 'protractor';

const EC = protractor.ExpectedConditions;

export class AppPage {
    clearLocalStorage(): wdpromise.Promise<any> {
        this.navigateToStart();
        return browser.executeScript('window.localStorage.clear();');
    }

    navigateToStart(): wdpromise.Promise<any> {
        return browser.get('/');
    }

    getParagraphText(): string {
        return element(by.css('app-root h1')).getText();
    }

    getOnBoardingButton(): ElementFinder {
        return element(by.css('button.onboarding-button'));
    }

    getOnBoardingMenuButtons(): ElementArrayFinder {
        return element.all(by.css('.mat-menu-content button'));
    }

    getTurnOffButton(): ElementFinder {
        return element(by.css('button[color="warn"]'));
    }

    waitAndCountOnboardingMenuItems(): ElementArrayFinder {
        browser.wait(EC.visibilityOf(element(by.css('.mat-menu-content'))), 10000);
        return element.all(by.css('.mat-menu-content button')).count();
    }

    waitAndCountOnboardingHeader(): ElementArrayFinder {
        // the onboarding overlay always has small delay so we have to wait a bit
        browser.wait(EC.visibilityOf(element(by.css('.onboarding-header'))), 10000);
        return element.all(by.css('.onboarding-header')).count();
    }

    countOnboardingHeader(): wdpromise.Promise<number> {
        // the onboarding overlay always has small delay so we have to wait a big
        return element.all(by.css('.onboarding-header')).count();
    }


}
