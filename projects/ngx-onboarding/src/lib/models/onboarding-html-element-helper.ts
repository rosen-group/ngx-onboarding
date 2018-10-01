/**
 * contains static helper methods for [[HTMLELement]]
 */
export class OnboardingHtmlElementHelper {

    /**
     * true if element is visible in view (not scrolled out) or false if not
     */
    public static isVisibleInView(ele: HTMLElement): boolean {
        console.log(ele.offsetParent);
        if (!ele || !ele.offsetParent) {
            return false;
        }
        const parentTop = ele.offsetParent.scrollTop;
        const parentBottom = parentTop + OnboardingHtmlElementHelper.getParentHeight(ele);
        const eleTop = ele.offsetTop;
        const eleBottom = eleTop + ele.offsetHeight;

        return parentTop < eleTop && parentBottom > eleBottom;
    }

    /**
     * true if element and all parents are visible in view (not scrolled out) or false if not
     */
    public static isVisibleInViewWithParents(ele: HTMLElement): boolean {
        let child = ele;
        let parent = <HTMLElement>ele.offsetParent;

        /*
        https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent:
        " ...
        In compliance with the specification, this property will return null on Webkit if the element is hidden (the style.display
        of this element or any ancestor is "none") or if the style.position of the element itself is set to "fixed".
        ..."
         */

        if (!parent) {
            if (typeof getComputedStyle !== 'function') {
                // this is how the angular material guys check for presence of this function
                // so it is also server side safe (see https://github.com/angular/material2/issues/3870)
                return false;
                // onboarding makes no sense on a prerendered server site (because the state of onboarding is always per individual)
            }
            const style = getComputedStyle(ele);
            if (style.display === 'none') {
                return false;
            }

        }

        while (parent) {
            if (parent.scrollTop > 0) {
                return OnboardingHtmlElementHelper.isVisibleInView(child);
            }
            child = parent;
            parent = <HTMLElement>child.offsetParent;
        }
        return true;
    }

    /**
     * returns the parent height of element or 0 if offsetParent is falsy (null, undefined, ...)
     */
    public static getParentHeight(ele: HTMLElement) {
        const parent: HTMLElement = <HTMLElement>ele.offsetParent;
        return parent ? parent.offsetHeight : 0;
    }

    /**
     * returns the position of element in document
     */
    public static getPosition(ele: HTMLElement) {
        let x = ele.offsetLeft;
        let y = ele.offsetTop;
        let parent = <HTMLElement>ele.offsetParent;
        while (parent != null) {
            x += parent.offsetLeft;
            y += parent.offsetTop - parent.scrollTop;
            parent = <HTMLElement>parent.offsetParent;
        }
        return {
            x: x,
            y: y,
            width: ele.offsetWidth,
            height: ele.offsetHeight
        };
    }


}
