import { browser, by, element, protractor } from 'protractor';
const EC = protractor.ExpectedConditions;

export class AppPage {
    clearLocalStorage() {
        this.navigateTo();
        browser.executeScript('window.localStorage.clear();');
    }

    navigateTo() {
        return browser.get('/');
    }

    getParagraphText() {
        return element(by.css('app-root h1')).getText();
    }


    getTurnOffButton() {
        return element(by.css('button[color="warn"]'));
    }

    waitAndCountOnboardingHeader() {
        // the onboarding overlay always has small delay so we have to wait a big
        browser.wait(EC.visibilityOf(element(by.css('.onboarding-header'))), 10000);
        return element.all(by.css('.onboarding-header')).count();
    }

    countOnboardingHeader() {
        // the onboarding overlay always has small delay so we have to wait a big
        return element.all(by.css('.onboarding-header')).count();
    }

}
