import {AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {OnboardingService} from './services';
import {
    OnboardingHtmlElementHelper,
    OnboardingItem,
    OnboardingItemContainer,
    OnboardingTextConfiguration,
    VisibleOnboardingItem
} from './models';
import {Subscription} from 'rxjs';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

/**
 * Main component of the onboarding module.
 * Handles the visualization of the onboarding items
 */
@Component({
    selector: 'rosen-onboarding',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class OnboardingComponent implements OnInit, AfterViewInit, OnDestroy {

    /**
     * all onboarding items
     */
    public items: VisibleOnboardingItem[];

    /**
     * if true, the "show next" button is visible
     * it false, the "got it" button is visible
     * is true, if there are more items to show
     */
    public hasNext: boolean;

    /**
     * Do not assign directly use onboardingSevice.configure
     * Name of the material icon to use (defaults to contact_support) (excludes fontSet,fontIcon and svgIcon)
     **/
    public matIconName: string;
    /**
     * Do not assign directly use onboardingSevice.configure
     * icon class for span (bootstrap style) (excludes matIconeName and svgIcon)
     */
    public fontSet: string;
    /**
     * Do not assign directly use onboardingSevice.configure
     *  icon class for span (bootstrap style) (excludes matIconeName and svgIcon)
     */
    public fontIcon: string;
    /**
     * Do not assign directly use onboardingSevice.configure
     *  name of registered svg icon (excludes matIconeName,fontSet and fontIcon)
     */
    public svgIcon: string;
    public dynamicCss: SafeStyle;
    private textConfig: OnboardingTextConfiguration;
    private visibleItemsChangedSubscription: Subscription;
    private allVisibleItems: OnboardingItemContainer;

    constructor(public onboardingService: OnboardingService, private domSanitizer: DomSanitizer) {
        this.items = [];
        const config = onboardingService.getConfiguration();
        this.textConfig = config.textConfiguration;
        if (config.iconConfiguration) { // we expect the config to be present always but just in case
            this.matIconName = config.iconConfiguration.matIconName;
            this.fontSet = config.iconConfiguration.fontSet;
            this.fontIcon = config.iconConfiguration.fontIcon;
            this.svgIcon = config.iconConfiguration.svgIcon;
        }

    }

    public ngOnInit() {
        // Dynamic generated css is needed because these options have be configurable
        let dynCss = ``;
        // for this component
        dynCss += `<style type="text/css">`;
        dynCss += `.onboarding-component-container .script-font { font-family: ${this.textConfig.scriptFontFamily}}`;
        dynCss += `.onboarding-component-container .regular-font { font-family: ${this.textConfig.regularFontFamily}}`;
        dynCss += `</style>`;
        this.dynamicCss = this.domSanitizer.bypassSecurityTrustHtml(dynCss);
    }

    public ngAfterViewInit() {

        this.visibleItemsChangedSubscription = this.onboardingService.visibleItemsChanged.subscribe(() => {
            this.allVisibleItems = this.onboardingService.visibleItems;

            this.items = this.onboardingService.visibleItems.currentItems;
            this.hasNext = this.allVisibleItems.hasNext;
            if (this.items) {
                this.items.forEach(r => this.showItem(r)); // show first group of items
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.visibleItemsChangedSubscription) {
            this.visibleItemsChangedSubscription.unsubscribe();
        }
        this.onboardingService.hide(); // hide ALL items
    }

    /**
     * gets the fixed position of the html element
     * used by template to set the position of the spotlight
     */
    public getPositionStyle(ele: HTMLElement) {
        const pos = OnboardingHtmlElementHelper.getPosition(ele);
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
            i.element.classList.add('onboarding-highlighted');
            if (!i.element.style.position || i.element.style.position === 'static') {
                i.element.classList.add('onboarding-highlighted-on-static');
            }
        }
    }

    /**
     * Hide SINGLE element without change notification
     */
    private hideItem(i: VisibleOnboardingItem) {
        i.element.classList.remove('onboarding-highlighted');
        i.element.classList.remove('onboarding-highlighted-on-static');
    }


}
