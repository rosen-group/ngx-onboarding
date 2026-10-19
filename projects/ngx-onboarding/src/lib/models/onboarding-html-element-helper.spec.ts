import { OnboardingHtmlElementHelper } from './onboarding-html-element-helper';

describe('OnboardingHtmlElementHelper', () => {

    it('isVisible expect to be true', () => {
        const element = document.createElement('div');
        const parent = document.createElement('div');
        vi.spyOn(element, 'offsetParent', 'get').mockReturnValue(parent);

        const isVisible = OnboardingHtmlElementHelper.isVisible(element);

        expect(isVisible).toBe(true);
    });

    it('isVisible with opacity 0 expect to be false', () => {
        const element = document.createElement('div');
        const parent = document.createElement('div');
        vi.spyOn(element, 'offsetParent', 'get').mockReturnValue(parent);
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            opacity: '0'
        } as any);

        const isVisible = OnboardingHtmlElementHelper.isVisible(element);

        expect(isVisible).toBe(false);
    });

    it('isVisible with display none expect to be false', () => {
        const element = document.createElement('div');
        const parent = document.createElement('div');
        vi.spyOn(element, 'offsetParent', 'get').mockReturnValue(parent);
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            opacity: '1',
            display: 'none'
        } as any);

        const isVisible = OnboardingHtmlElementHelper.isVisible(element);

        expect(isVisible).toBe(false);
    });

    it('isVisible with visibility hidden expect to be false', () => {
        const element = document.createElement('div');
        const parent = document.createElement('div');
        vi.spyOn(element, 'offsetParent', 'get').mockReturnValue(parent);
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            opacity: '1',
            display: 'block',
            visibility: 'hidden'
        } as any);

        const isVisible = OnboardingHtmlElementHelper.isVisible(element);

        expect(isVisible).toBe(false);
    });

    it('isVisible with visibility collapse expect to be false', () => {
        const element = document.createElement('div');
        const parent = document.createElement('div');
        vi.spyOn(element, 'offsetParent', 'get').mockReturnValue(parent);
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            opacity: '1',
            display: 'block',
            visibility: 'collapse'
        } as any);

        const isVisible = OnboardingHtmlElementHelper.isVisible(element);

        expect(isVisible).toBe(false);
    });

    it('expect isNotScrolledOut to be true', () => {
        const element = document.createElement('div');
        vi.spyOn(element, 'offsetTop', 'get').mockReturnValue(10);
        vi.spyOn(element, 'offsetHeight', 'get').mockReturnValue(100);

        const parent = <HTMLElement>document.createElement('div');
        vi.spyOn(parent, 'scrollTop', 'get').mockReturnValue(0);
        vi.spyOn(parent, 'offsetHeight', 'get').mockReturnValue(500);
        vi.spyOn(element, 'offsetParent', 'get').mockReturnValue(parent);

        parent.appendChild(element);

        const isNotScrolledOut = OnboardingHtmlElementHelper.isNotScrolledOut(element);

        expect(isNotScrolledOut).toBe(true);
    });

    it('expect isNotScrolledOut to be false', () => {
        const element = document.createElement('div');
        vi.spyOn(element, 'offsetTop', 'get').mockReturnValue(510);
        vi.spyOn(element, 'offsetHeight', 'get').mockReturnValue(100);

        const parent = <HTMLElement>document.createElement('div');
        vi.spyOn(parent, 'scrollTop', 'get').mockReturnValue(0);
        vi.spyOn(parent, 'offsetHeight', 'get').mockReturnValue(500);
        vi.spyOn(element, 'offsetParent', 'get').mockReturnValue(parent);

        const isNotScrolledOut = OnboardingHtmlElementHelper.isNotScrolledOut(element);

        expect(isNotScrolledOut).toBe(false);
    });

    it('expect isVisibleInViewWithParents to be true', () => {
        const element = document.createElement('div');
        vi.spyOn(element, 'offsetTop', 'get').mockReturnValue(0);
        vi.spyOn(element, 'offsetHeight', 'get').mockReturnValue(100);

        const parent = <HTMLElement>document.createElement('div');
        vi.spyOn(parent, 'scrollTop', 'get').mockReturnValue(0);
        vi.spyOn(parent, 'offsetHeight', 'get').mockReturnValue(500);
        vi.spyOn(element, 'offsetParent', 'get').mockReturnValue(parent);

        const parentParent = <HTMLElement>document.createElement('div');
        vi.spyOn(parentParent, 'scrollTop', 'get').mockReturnValue(0);
        vi.spyOn(parentParent, 'offsetHeight', 'get').mockReturnValue(500);
        vi.spyOn(parent, 'offsetParent', 'get').mockReturnValue(parentParent);

        const body = <HTMLElement>document.createElement('body');
        vi.spyOn(parentParent, 'offsetParent', 'get').mockReturnValue(body);

        const isVisible = OnboardingHtmlElementHelper.isVisibleInViewWithParents(element);

        expect(isVisible).toBe(true);
    });

    it('expect isVisibleInViewWithParents to be false', () => {
        const element = document.createElement('div');
        vi.spyOn(element, 'offsetTop', 'get').mockReturnValue(0);
        vi.spyOn(element, 'offsetHeight', 'get').mockReturnValue(100);

        const parent = <HTMLElement>document.createElement('div');
        vi.spyOn(parent, 'scrollTop', 'get').mockReturnValue(510);
        vi.spyOn(parent, 'offsetHeight', 'get').mockReturnValue(500);
        vi.spyOn(element, 'offsetParent', 'get').mockReturnValue(parent);

        const parentParent = <HTMLElement>document.createElement('div');
        vi.spyOn(parentParent, 'scrollTop', 'get').mockReturnValue(0);
        vi.spyOn(parentParent, 'offsetHeight', 'get').mockReturnValue(500);
        vi.spyOn(parent, 'offsetParent', 'get').mockReturnValue(parentParent);

        const isVisible = OnboardingHtmlElementHelper.isVisibleInViewWithParents(element);

        expect(isVisible).toBe(false);
    });

    it('expect getPosition to be ...', () => {
        const element = document.createElement('div');
        vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
            bottom: 10,
            height: 11,
            left: 12,
            right: 13,
            top: 14,
            width: 15
        } as any);
        vi.spyOn(OnboardingHtmlElementHelper as any, 'isFixed').mockReturnValue(true);

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
        vi.spyOn(element, 'offsetParent', 'get').mockReturnValue(parent);
        vi.spyOn(window, 'getComputedStyle').mockImplementation((htmlElement: Element): any => {
            if (htmlElement === element) {
                return {
                    position: 'static'
                };
            }
            else {
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
        vi.spyOn(element, 'offsetParent', 'get').mockReturnValue(null);
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            position: 'relative'
        } as any);

        const isFixed = (OnboardingHtmlElementHelper as any).isFixed(element);

        expect(isFixed).toBe(false);
    });

});
