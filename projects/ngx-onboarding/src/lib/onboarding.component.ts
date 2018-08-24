import {AfterViewInit, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {OnboardingService} from './onboarding.service';
import {VisibleOnboardingItem} from './models/visible-onboarding-item.model';
import {OnboardingItemContainer} from './models/onboarding-item-container.model';
import {OnboardingItem} from './models/onboarding-item.model';
import {Subscription} from 'rxjs';
import { HtmlElementHelper } from './models/onboarding-html-helper';
import {BrowserDOMSelectorService} from './models/browser-dom-selector.service';

/**
 * OnboardingComponent
 *
 * Do not use this Component directly. Use the register method of [[OnboardingService]]
 *
 */
@Component({
  selector: 'rosen-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.less'],
  providers: [OnboardingService, BrowserDOMSelectorService],
  encapsulation: ViewEncapsulation.None
})
export class OnboardingComponent implements AfterViewInit, OnDestroy {

  /**
   * all onboarding items
   */
  public items: VisibleOnboardingItem[];

  /**
   * used by template
   * if true, the "show next" button is visible
   * it false, the "got it" button is visible
   * is true, if there are more items to show
   */
  public hasNext: boolean;

  private visibleItemsChangedSubscription: Subscription;
  private allVisibleItems: OnboardingItemContainer;

  constructor(public onboardingService: OnboardingService) {
    this.items = [];
  }

  public ngAfterViewInit(): void {
    this.visibleItemsChangedSubscription = this.onboardingService.visibleItemsChanged.subscribe(() => {
      this.allVisibleItems = this.onboardingService.visibleItems;

      this.items = this.onboardingService.visibleItems.curItems;
      this.hasNext = this.allVisibleItems.hasNext;
      if (this.items) {
        this.items.forEach(r => this.showItem(r)); // show first group of items
      }

    });
  }

  public ngOnDestroy(): void {
    if (this.visibleItemsChangedSubscription) { this.visibleItemsChangedSubscription.unsubscribe(); }
    this.onboardingService.hide(); // hide ALL items
  }

  /**
   * gets the fixed position of the html element
   * used by template to set the position of the spotlight
   */
  public getPositionStyle(ele: HTMLElement) {
    const pos = HtmlElementHelper.getPosition(ele);
    return {
      position: 'fixed',
      left: pos.x + 'px',
      top: pos.y + 'px',
      width: pos.width + 'px',
      height: pos.height + 'px'
    };
  }

  public isSpotlightTransparent(item: OnboardingItem) {
    return item.transparentSpotlight;
  }

  /**
   * used by turn off button in template
   */
  public disable(): void {

    this.items.forEach(x => this.hideItem(x)); // hide OLD items

    this.onboardingService.disable();

  }

  /**
   * hide current group (show next one if one is available
   */
  public hide(): void {
    if (this.allVisibleItems && this.hasNext) {
      // hide current and show next group

      this.items.forEach(x => this.hideItem(x)); // hide OLD items

      this.items = this.allVisibleItems.nextItems();
      this.hasNext = this.allVisibleItems.hasNext; // show NEW ones

      this.items.forEach(x => this.showItem(x));
    } else {

      // last group => hide items
      this.allVisibleItems.allItems.forEach(x => this.hideItem(x));

      this.onboardingService.hide(); // mark all items as seen...
      this.items = [];
      this.hasNext = false;
    }
  }

  /**
   * Show onboarding item
   */
  private showItem(i: VisibleOnboardingItem) {
    if (this.onboardingService.isEnabled()) {
      i.ele.classList.add('onboarding-highlighted');
      if (!i.ele.style.position || i.ele.style.position === 'static') {
        i.ele.classList.add('onboarding-highlighted-on-static');
      }
    }
  }

  /**
   * Hide SINGLE element without change notification
   */
  private hideItem(i: VisibleOnboardingItem) {
    i.ele.classList.remove('onboarding-highlighted');
    i.ele.classList.remove('onboarding-highlighted-on-static');
  }


}
