import { AppPage } from './app.po';

describe('workspace-project App', () => {
    let page: AppPage;

    beforeAll(() => {
        if (!page) {
            page = new AppPage();
        }
        page.clearLocalStorage();
    });

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display welcome message', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('Welcome to ngx-onboarding-app!');
    });

    it('should show onboarding overlay initially and hide it if "Turn Off" button is clicked', () => {
        expect(page.waitAndCountOnboardingHeader()).toBe(1, 'onboarding header should be visible');
        page.getTurnOffButton().click();
        expect(page.countOnboardingHeader()).toBe(0, 'onboarding header should not bevisible');
    });
});
