import { OnboardingHtmlElementHelper } from './onboarding-html-element-helper';

describe('OnboardingHtmlElementHelper', () => {

    it('expect isVisibleInView to be true', () => {
        const element = document.createElement('div');
        spyOnProperty(element, 'offsetTop').and.returnValue(10);
        spyOnProperty(element, 'offsetHeight').and.returnValue(100);

        const parent = <HTMLElement>document.createElement('div');
        spyOnProperty(parent, 'scrollTop').and.returnValue(0);
        spyOnProperty(parent, 'offsetHeight').and.returnValue(500);
        spyOnProperty(element, 'offsetParent').and.returnValue(parent);

        parent.appendChild(element);

        const isVisible = OnboardingHtmlElementHelper.isVisibleInView(element);

        expect(isVisible).toBe(true);
    });

    it('expect isVisibleInView to be false', () => {
        const element = document.createElement('div');
        spyOnProperty(element, 'offsetTop').and.returnValue(510);
        spyOnProperty(element, 'offsetHeight').and.returnValue(100);

        const parent = <HTMLElement>document.createElement('div');
        spyOnProperty(parent, 'scrollTop').and.returnValue(0);
        spyOnProperty(parent, 'offsetHeight').and.returnValue(500);
        spyOnProperty(element, 'offsetParent').and.returnValue(parent);

        const isVisible = OnboardingHtmlElementHelper.isVisibleInView(element);

        expect(isVisible).toBe(false);
    });

    it('expect isVisibleInViewWithParents to be true', () => {
        const element = document.createElement('div');
        spyOnProperty(element, 'offsetTop').and.returnValue(0);
        spyOnProperty(element, 'offsetHeight').and.returnValue(100);

        const parent = <HTMLElement>document.createElement('div');
        spyOnProperty(parent, 'scrollTop').and.returnValue(0);
        spyOnProperty(parent, 'offsetHeight').and.returnValue(500);
        spyOnProperty(element, 'offsetParent').and.returnValue(parent);

        const parentParent = <HTMLElement>document.createElement('div');
        spyOnProperty(parentParent, 'scrollTop').and.returnValue(0);
        spyOnProperty(parentParent, 'offsetHeight').and.returnValue(500);
        spyOnProperty(parent, 'offsetParent').and.returnValue(parentParent);

        const isVisible = OnboardingHtmlElementHelper.isVisibleInViewWithParents(element);

        expect(isVisible).toBe(true);
    });

    it('expect isVisibleInViewWithParents to be false', () => {
        const element = document.createElement('div');
        spyOnProperty(element, 'offsetTop').and.returnValue(0);
        spyOnProperty(element, 'offsetHeight').and.returnValue(100);

        const parent = <HTMLElement>document.createElement('div');
        spyOnProperty(parent, 'scrollTop').and.returnValue(510);
        spyOnProperty(parent, 'offsetHeight').and.returnValue(500);
        spyOnProperty(element, 'offsetParent').and.returnValue(parent);

        const parentParent = <HTMLElement>document.createElement('div');
        spyOnProperty(parentParent, 'scrollTop').and.returnValue(0);
        spyOnProperty(parentParent, 'offsetHeight').and.returnValue(500);
        spyOnProperty(parent, 'offsetParent').and.returnValue(parentParent);

        const isVisible = OnboardingHtmlElementHelper.isVisibleInViewWithParents(element);

        expect(isVisible).toBe(false);
    });

    it('expect getPosition to be ...', () => {
        const element = document.createElement('div');
        const parent = <HTMLElement>document.createElement('div');

        spyOnProperty(element, 'offsetLeft').and.returnValue(100);
        spyOnProperty(element, 'offsetTop').and.returnValue(200);
        spyOnProperty(element, 'offsetParent').and.returnValue(parent);
        spyOnProperty(element, 'offsetWidth').and.returnValue(300);
        spyOnProperty(element, 'offsetHeight').and.returnValue(400);

        spyOnProperty(parent, 'offsetLeft').and.returnValue(1);
        spyOnProperty(parent, 'offsetTop').and.returnValue(2);
        spyOnProperty(parent, 'scrollTop').and.returnValue(3);

        const position = OnboardingHtmlElementHelper.getPosition(element);

        expect(position.x).toBe(101);
        expect(position.y).toBe(199);
        expect(position.width).toBe(300);
        expect(position.height).toBe(400);
    });

});
