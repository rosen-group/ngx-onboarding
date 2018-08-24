/**
 * contains static helper methods for [[HTMLELement]]
 */
export class HtmlElementHelper {

  /**
   * true if ele is visible in view (not scrolled out) or false if not
   */
  public static isVisibleInView(ele: HTMLElement): boolean {
    if (!ele || !ele.offsetParent) { return false; }
    const parentTop = ele.offsetParent.scrollTop;
    const parentBottom = parentTop + HtmlElementHelper.getParentHeight(ele);
    const eleTop = ele.offsetTop;
    const eleBottom = eleTop + ele.offsetHeight;

    return parentTop < eleTop && parentBottom > eleBottom;
  }

  /**
   * true if ele and all parents are visible in view (not scrolled out) or false if not
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

      const style = window.getComputedStyle(ele);
      if (style.display === 'none') {
        return false;
      }

    }

    while (parent) {
      if (parent.scrollTop > 0) {
        return HtmlElementHelper.isVisibleInView(child);
      }
      child = parent;
      parent = <HTMLElement>child.offsetParent;
    }
    return true;
  }

  /**
   * returns the parent height of ele or 0 if offsetParent is falsy (null, undefined, ...)
   */
  public static getParentHeight(ele: HTMLElement) {
    const parent: HTMLElement = <HTMLElement>ele.offsetParent;
    return parent ? parent.offsetHeight : 0;
  }

  /**
   * returns the position of ele in document
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
