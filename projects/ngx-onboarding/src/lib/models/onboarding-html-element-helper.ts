/**
 * contains static helper methods for [[HTMLELement]]
 */

export class OnboardingHtmlElementHelper {

    public static isVisible(htmlElement: HTMLElement): boolean {
        if (!htmlElement || typeof getComputedStyle !== 'function') {
            return false;
        }

        const style = getComputedStyle(htmlElement);

        if (!htmlElement.offsetParent && style.position !== 'fixed') {
            return false;
        }

        return !(style.opacity === '0' || style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse');
    }

    /**
     * true if element is visible in view (not scrolled out) or false if not
     */
    public static isNotScrolledOut(htmlElement: HTMLElement): boolean {
        if (!htmlElement || !htmlElement.offsetParent) {
            return false;
        }
        const parent = <HTMLElement>htmlElement.offsetParent;
        const parentTop = parent.scrollTop;
        const parentBottom = parentTop + parent.offsetHeight;
        const elementTop = htmlElement.offsetTop;
        const elementBottom = elementTop + htmlElement.offsetHeight;

        return parentTop < elementTop && parentBottom > elementBottom;
    }

    /**
     * true if element and all parents are visible in view (not scrolled out) or false if not
     */
    public static isVisibleInViewWithParents(htmlElement: HTMLElement): boolean {
        do {
            if (htmlElement && htmlElement.tagName && htmlElement.tagName.toLowerCase() === 'body') {
                return true;
            }
            if (!OnboardingHtmlElementHelper.isVisible(htmlElement)) {
                return false;
            }
            if (htmlElement.scrollTop > 0) {
                if (!OnboardingHtmlElementHelper.isNotScrolledOut(htmlElement)) {
                    return false;
                }
            }
        } while (htmlElement = <HTMLElement>htmlElement.offsetParent);
        return true;
    }

    /**
     * returns the position of element in document
     */
    public static getPosition(htmlElement: HTMLElement) {
        const rect: ClientRect | DOMRect = htmlElement.getBoundingClientRect();
        if (typeof DOMRect !== 'undefined' && rect instanceof DOMRect) {
            return {
                fixed: OnboardingHtmlElementHelper.isFixed(htmlElement),
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height
            };
        }
        return {
            fixed: OnboardingHtmlElementHelper.isFixed(htmlElement),
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height
        };
    }

    private static isFixed(htmlElement: HTMLElement) {
        if (!htmlElement || typeof getComputedStyle !== 'function') {
            return false;
        }
        const style = getComputedStyle(htmlElement);
        if (style.position === 'fixed') {
            return true;
        }
        return OnboardingHtmlElementHelper.isFixed(<HTMLElement>htmlElement.offsetParent);
    }

}
