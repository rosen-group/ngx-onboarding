import {OnboardingHtmlElementHelper} from './onboarding-html-element-helper';

describe('OnboardingHtmlElementHelper', () => {

    it('isVisible expect to be true', () => {
        const element = document.createElement('div');
        const parent = document.createElement('div');
        spyOnProperty(element, 'offsetParent').and.returnValue(parent);

        const isVisible = OnboardingHtmlElementHelper.isVisible(element);

        expect(isVisible).toBe(true);
    });

    it('isVisible with opacity 0 expect to be false', () => {
        const element = document.createElement('div');
        const parent = document.createElement('div');
        spyOnProperty(element, 'offsetParent').and.returnValue(parent);
        spyOn((window as any), 'getComputedStyle').and.returnValue({
            opacity: '0'
        });

        const isVisible = OnboardingHtmlElementHelper.isVisible(element);

        expect(isVisible).toBe(false);
    });

    it('isVisible with display none expect to be false', () => {
        const element = document.createElement('div');
        const parent = document.createElement('div');
        spyOnProperty(element, 'offsetParent').and.returnValue(parent);
        spyOn((window as any), 'getComputedStyle').and.returnValue({
            opacity: '1',
            display: 'none'
        });

        const isVisible = OnboardingHtmlElementHelper.isVisible(element);

        expect(isVisible).toBe(false);
    });

    it('isVisible with visibility hidden expect to be false', () => {
        const element = document.createElement('div');
        const parent = document.createElement('div');
        spyOnProperty(element, 'offsetParent').and.returnValue(parent);
        spyOn((window as any), 'getComputedStyle').and.returnValue({
            opacity: '1',
            display: 'block',
            visibility: 'hidden'
        });

        const isVisible = OnboardingHtmlElementHelper.isVisible(element);

        expect(isVisible).toBe(false);
    });

    it('isVisible with visibility collapse expect to be false', () => {
        const element = document.createElement('div');
        const parent = document.createElement('div');
        spyOnProperty(element, 'offsetParent').and.returnValue(parent);
        spyOn((window as any), 'getComputedStyle').and.returnValue({
            opacity: '1',
            display: 'block',
            visibility: 'collapse'
        });

        const isVisible = OnboardingHtmlElementHelper.isVisible(element);

        expect(isVisible).toBe(false);
    });

    it('expect isNotScrolledOut to be true', () => {
        const element = document.createElement('div');
        spyOnProperty(element, 'offsetTop').and.returnValue(10);
        spyOnProperty(element, 'offsetHeight').and.returnValue(100);

        const parent = <HTMLElement>document.createElement('div');
        spyOnProperty(parent, 'scrollTop').and.returnValue(0);
        spyOnProperty(parent, 'offsetHeight').and.returnValue(500);
        spyOnProperty(element, 'offsetParent').and.returnValue(parent);

        parent.appendChild(element);

        const isNotScrolledOut = OnboardingHtmlElementHelper.isNotScrolledOut(element);

        expect(isNotScrolledOut).toBe(true);
    });

    it('expect isNotScrolledOut to be false', () => {
        const element = document.createElement('div');
        spyOnProperty(element, 'offsetTop').and.returnValue(510);
        spyOnProperty(element, 'offsetHeight').and.returnValue(100);

        const parent = <HTMLElement>document.createElement('div');
        spyOnProperty(parent, 'scrollTop').and.returnValue(0);
        spyOnProperty(parent, 'offsetHeight').and.returnValue(500);
        spyOnProperty(element, 'offsetParent').and.returnValue(parent);

        const isNotScrolledOut = OnboardingHtmlElementHelper.isNotScrolledOut(element);

        expect(isNotScrolledOut).toBe(false);
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

        const body = <HTMLElement>document.createElement('body');
        spyOnProperty(parentParent, 'offsetParent').and.returnValue(body);

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
        spyOn(element, 'getBoundingClientRect').and.returnValue({
            bottom: 10,
            height: 11,
            left: 12,
            right: 13,
            top: 14,
            width: 15
        });
        spyOn(OnboardingHtmlElementHelper as any, 'isFixed').and.returnValue(true);

        const position = OnboardingHtmlElementHelper.getPosition(element);

        expect(position.fixed).toBe(true);
        expect(position.x).toBe(12);
        expect(position.y).toBe(14);
        expect(position.width).toBe(15);
        expect(position.height).toBe(11);
    });

    it('isFixed expect to be true', () => {
        const element = document.createElement('div');
        const parent = document.createElement('div');
        spyOnProperty(element, 'offsetParent').and.returnValue(parent);
        spyOn((window as any), 'getComputedStyle').and.callFake((htmlElement) => {
            if (htmlElement === element) {
                return {
                    position: 'static'
                };
            } else {
                return {
                    position: 'fixed'
                };
            }
        });

        const isFixed = (OnboardingHtmlElementHelper as any).isFixed(element);

        expect(isFixed).toBe(true);
    });

    it('isFixed with parent null expect to be false', () => {
        const element = document.createElement('div');
        spyOnProperty(element, 'offsetParent').and.returnValue(null);
        spyOn((window as any), 'getComputedStyle').and.returnValue({
            position: 'relative'
        });

        const isFixed = (OnboardingHtmlElementHelper as any).isFixed(element);

        expect(isFixed).toBe(false);
    });

});
