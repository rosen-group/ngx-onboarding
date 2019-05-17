import { AppPage } from './app.po';

describe('workspace-project App', () => {
    let page: AppPage;

    beforeAll(() => {
        page = new AppPage();
        page.clearLocalStorage();
    });

    it('should display welcome message', () => {
        page.navigateToStart();
        expect(page.getParagraphText()).toEqual('Welcome to ngx-onboarding-app!');
    });

    it('shows onboarding overlay when onboarding is enabled', (done) => {

        page.getOnBoardingButton().click(); // this the main "onboarding" button
        // after click we expect a menu with 2 items to be visible
        expect(page.waitAndCountOnboardingMenuItems()).toEqual(2);
        // get menu item buttons and click the first
        page.getOnBoardingMenuButtons().then((btns) => {
            btns[0].click(); // the first button is "Turn on"
            expect(page.waitAndCountOnboardingHeader()).toBe(1, 'onboarding header should be visible');
            done();
        });
    });

    it('hides onboarding overlay when onboarding was enabled and hide it if "Turn Off" button is clicked', () => {
        expect(page.waitAndCountOnboardingHeader()).toBe(1, 'onboarding header should be visible');
        page.getTurnOffButton().click();
        expect(page.countOnboardingHeader()).toBe(0, 'onboarding header should not be visible');
    });
});
