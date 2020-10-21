import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {OnboardingButtonsPosition} from './models/onboarding-buttons-position.enum';
import {OnboardingButtonsConfiguration} from './models/onboarding-buttons-configuration.interface';
import {VisibleOnboardingItem} from './models/visible-onboarding-item.model';
import {OnboardingTextConfiguration} from './models/onboarding-text-configuration.interface';
import {OnboardingItemContainer} from './models/onboarding-item-container.model';
import {OnboardingService} from './services/onboarding.service';
import {OnboardingHtmlElementHelper} from './models/onboarding-html-element-helper';
import {OnboardingItem} from './models/onboarding-item.model';
import {AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

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
     * current visible onboarding item
     */
    public visibleItem: VisibleOnboardingItem;

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
    private buttonConfig: OnboardingButtonsConfiguration;
    private visibleItemsChangedSubscription: Subscription;

    constructor(public onboardingService: OnboardingService, private domSanitizer: DomSanitizer) {
        this.visibleItem = null;
        const config = onboardingService.getConfiguration();
        this.textConfig = config.textConfiguration;
        this.buttonConfig = config.buttonsConfiguration;
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
            this.visibleItem = this.onboardingService.visibleItems.currentItem;
            this.hasNext = this.onboardingService.visibleItems.hasNext;
            if (this.visibleItem) {
                this.showItem(this.visibleItem);
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
        const style: any = {
            position: 'fixed',
            left: pos.x + 'px',
            top: pos.y + 'px',
            width: pos.width + 'px',
            height: pos.height + 'px'
        };
        if (pos.fixed) {
            style.background = 'transparent';
        }
        return style;
    }

    public isSpotlightTransparent(item: OnboardingItem) {
        return item.transparentSpotlight;
    }

    /**
     * used by turn off button in template
     */
    public disable(): void {
        if (this.visibleItem) {
            this.hideItem(this.visibleItem); // hide old item
        }
        this.onboardingService.disable();
    }

    /**
     * hide current group (show next one if one is available
     */
    public hide(): void {
        if (this.onboardingService.visibleItems && this.hasNext) {
            // hide current and show next item
            this.hideItem(this.visibleItem); // hide OLD items
            this.visibleItem = this.onboardingService.visibleItems.nextItem();
            this.hasNext = this.onboardingService.visibleItems.hasNext; // show NEW ones
            this.showItem(this.visibleItem);
        } else {
            this.hideItem(this.visibleItem);
            this.onboardingService.hide(); // mark all items as seen...
            this.visibleItem = null;
            this.hasNext = false;
        }
    }

    public buttonsPositionStyle(): any {
        switch (this.buttonConfig.position) {
            case OnboardingButtonsPosition.Bottom:
                return {
                    bottom: this.buttonConfig.verticalDistanceToBorderInPx + 'px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                };
            case OnboardingButtonsPosition.BottomLeft:
                return {
                    bottom: this.buttonConfig.verticalDistanceToBorderInPx + 'px',
                    left: this.buttonConfig.horizontalDistanceToBorderInPx + 'px',
                };
            case OnboardingButtonsPosition.Left:
                return {
                    top: '50%',
                    transform: 'translateY(-50%)',
                    left: this.buttonConfig.horizontalDistanceToBorderInPx + 'px'
                };
            case OnboardingButtonsPosition.TopLeft:
                return {
                    top: this.buttonConfig.verticalDistanceToBorderInPx + 'px',
                    left: this.buttonConfig.horizontalDistanceToBorderInPx + 'px'
                };
            case OnboardingButtonsPosition.Top:
                return {
                    top: this.buttonConfig.verticalDistanceToBorderInPx + 'px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                };
            case OnboardingButtonsPosition.TopRight:
                return {
                    top: this.buttonConfig.verticalDistanceToBorderInPx + 'px',
                    right: this.buttonConfig.horizontalDistanceToBorderInPx + 'px'
                };
            case OnboardingButtonsPosition.Right:
                return {
                    top: '50%',
                    transform: 'translateY(-50%)',
                    right: this.buttonConfig.horizontalDistanceToBorderInPx + 'px'
                };
            case OnboardingButtonsPosition.BottomRight:
            default:
                return {
                    bottom: this.buttonConfig.verticalDistanceToBorderInPx + 'px',
                    right: this.buttonConfig.horizontalDistanceToBorderInPx + 'px'
                };
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
