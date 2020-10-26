import {interval, Subscription, timer} from 'rxjs';
import {ErrorHandler, EventEmitter, Injectable, NgZone} from '@angular/core';
import {BrowserDOMSelectorService} from './browser-dom-selector.service';
import {OnboardingItemContainer} from '../models/onboarding-item-container.model';
import {OnboardingConfiguration} from '../models/onboarding-configuration.model';
import {VisibleOnboardingItem} from '../models/visible-onboarding-item.model';
import {OnboardingHtmlElementHelper} from '../models/onboarding-html-element-helper';
import {OnboardingItem} from '../models/onboarding-item.model';
import {EnabledStatusBaseService} from './enabled-status-base.service';
import {OnboardingButtonsPosition} from '../models/onboarding-buttons-position.enum';
import {SeenSelectorsBaseService} from './seen-selectors-base.service';
import {each, filter, find,  some} from 'lodash-es';

const addSeenSelectorDebounceTime = 1000;
const enabledChangedDebounceTime = 1000;
const refreshTime = 2000;


/**
 * The OnboardingService manages the configuration and the status of the onboarding component.
 *
 * The OnboardingComponent listens to the visibleItemsChanged event and retrieves new onboarding items from the visibleItems object.
 */
@Injectable({
    providedIn: 'root' /* makes sure that service stays a single instance among seperate modules */
})
export class OnboardingService {

    /**
     * Container with currently visible onboarding items (grouped).
     * OnboardingComponent must iterate through these groups.
     *
     * called by OnboardingComponent
     */
    public readonly visibleItems = new OnboardingItemContainer();
    /**
     * called by OnboardingComponent
     */
    public visibleItemsChanged = new EventEmitter();
    private addSeenSelectorDebounceSubscription: Subscription;
    private enabledChangedDebounceSubscription: Subscription;
    private refreshSubscription: Subscription;
    private items: Array<OnboardingItem>;
    private seenSelectors: Array<string>;
    private enabled: boolean;
    private configuration: OnboardingConfiguration;

    private readonly defaultConfiguration: OnboardingConfiguration = {
        iconConfiguration: {
            matIconName: 'contact_support',
            matBadgeColor: 'accent',
            matBadgePosition: 'below after',
            matBadgeSize: 'medium'
        },
        textConfiguration: {
            regularFontFamily: 'Roboto, "Segoe UI", Helvetica, Arial, sans-serif;',
            scriptFontFamily: '"Gochi Hand", Georgia, "Segoe Script",  "Comic Sans MS", serif'
        },
        buttonsConfiguration: {
            position: OnboardingButtonsPosition.BottomRight,
            horizontalDistanceToBorderInPx: 50,
            verticalDistanceToBorderInPx: 40
        }
    };

    constructor(private browserDomSelectorService: BrowserDOMSelectorService,
                private loadAndSaveSeenSelectorsService: SeenSelectorsBaseService,
                private loadAndSaveEnabledStatusService: EnabledStatusBaseService,
                private errorHandler: ErrorHandler,
                private zone: NgZone) {
        this.configuration = this.defaultConfiguration;
        /* this is the default setting. can be changed by configure()*/
        this.init();
    }

    /**
     * returns the count of the registered items
     */
    public get registeredItemsCount(): number {
        return this.items.length;
    }

    /**
     * Configures the onboarding icons and fonts.
     *
     * If you want to change the default settings, then call this in your module where you import this
     * service as provider and set global defaults like icon properties
     */
    public configure(configuration: OnboardingConfiguration) {
        if (typeof configuration === 'undefined') {
            throw new Error('Configuration must not be undefined or null');
        }
        // new merge default configuration with user configuration
        const mergedConfig: OnboardingConfiguration = {
            iconConfiguration: Object.assign({}, this.defaultConfiguration.iconConfiguration),
            textConfiguration: Object.assign({}, this.defaultConfiguration.textConfiguration),
            buttonsConfiguration: Object.assign({}, this.defaultConfiguration.buttonsConfiguration)
        };

        if (configuration.iconConfiguration) {
            Object.assign(
                mergedConfig.iconConfiguration,
                configuration.iconConfiguration
            );
            // icon shape configurations are mutually exclusive so a special checks are needed for that
            if (!configuration.iconConfiguration.matIconName &&
                (configuration.iconConfiguration.fontSet || configuration.iconConfiguration.svgIcon)) {
                mergedConfig.iconConfiguration.matIconName = undefined; // if the user wants fontSet than we have to disable matIconName
            }
        }

        if (configuration.textConfiguration) {
            Object.assign(
                mergedConfig.textConfiguration,
                configuration.textConfiguration
            );
        }

        if (configuration.buttonsConfiguration) {
            Object.assign(
                mergedConfig.buttonsConfiguration,
                configuration.buttonsConfiguration
            );
        }

        this.configuration = mergedConfig;
    }

    /** used internal only to retrieve to configuration from configure()*/
    public getConfiguration() {
        return this.configuration;
    }

    /**
     * registers [[OnboardingItem]]s in items, returns the method to unregister items (e.g. in ngOnDestroy)
     */
    public register(items: Array<OnboardingItem>): Function {
        this.items.push(...items);
        return () => {
            this.items = filter(this.items, thisItem => !some(items, item => thisItem.selector === item.selector));
        };
    }

    /**
     * Check which onboarding items are visible. Emit visibleItemsChanged event.
     * called by OnboardingComponent
     */
    public check() {
        try {
            if (this.isEnabled() && this.visibleItems && this.visibleItems.totalLength > 0) {
                return;
            }
            const matches: Array<VisibleOnboardingItem> = [];
            const notSeenItems = this.getNotSeenItems();
            if (notSeenItems) {
                each(notSeenItems, item => {
                    const elements = this.browserDomSelectorService.querySelectorAll(item.selector);
                    if (elements && elements.length > 0) {
                        let element: HTMLElement = find(
                            elements, (e: HTMLElement) => OnboardingHtmlElementHelper.isVisibleInViewWithParents(e)
                        );
                        if (element) {
                            if (item.toParent && element.offsetParent) {
                                element = <HTMLElement>element.offsetParent;
                            }
                            if (element) {
                                matches.push({
                                    item: item,
                                    element: element
                                });
                            }
                        }
                    }
                });
            }

            this.visibleItems.clear();
            this.visibleItems.add(matches);
            this.visibleItemsChanged.emit();
        } catch (error) {
            this.errorHandler.handleError(error);
        }
    }

    /**
     * Mark all visible items as SEEN, remove them from visible list and emit change event.
     * called by OnboardingComponent
     */
    public hide() {

        each(this.visibleItems.allItems, i => {
            this.addToSeenSelectors(i.item.selector);
        });

        this.visibleItems.clear();
        this.visibleItemsChanged.emit();
    }

    /**
     * called by OnboardingComponent
     *
     * Disables the onboarding
     */
    public disable() {
        this.hide();
        this.enabled = false;
        this.visibleItemsChanged.emit();
        this.enabledChanged();
    }

    /**
     * called by OnboardingComponent
     *
     * Enables the onboarding
     */
    public enable() {
        this.enabled = true;
        this.visibleItems.clear();
        this.check();
        this.enabledChanged();
    }

    /**
     * called by OnboardingComponent
     */
    public isEnabled(): boolean {
        return this.enabled;
    }

    /**
     * called by OnboardingComponent
     */
    public clearSeenSelectors(): void {
        this.seenSelectors = [];
        this.seenSelectorsChanged();
    }

    private init() {
        this.items = [];
        this.seenSelectors = [];
        this.visibleItems.clear();
        this.loadSeenSelectors();
        this.loadEnabledStatus();
        this.startRefreshTimer();
    }

    private addToSeenSelectors(selector: string) {
        this.seenSelectors.push(selector);
        this.seenSelectorsChanged();
    }

    private seenSelectorsChanged(): void {
        if (this.addSeenSelectorDebounceSubscription) {
            this.addSeenSelectorDebounceSubscription.unsubscribe();
        }
        const source = timer(addSeenSelectorDebounceTime);
        this.addSeenSelectorDebounceSubscription = source.subscribe(() => {
            this.saveSeenSelectors();
        });
    }

    private enabledChanged() {
        if (this.enabledChangedDebounceSubscription) {
            this.enabledChangedDebounceSubscription.unsubscribe();
        }
        const source = timer(enabledChangedDebounceTime);
        this.enabledChangedDebounceSubscription = source.subscribe(() => {
            this.saveEnabledStatus();
        });
    }

    private getNotSeenItems(): Array<OnboardingItem> {
        return filter(this.items, i => !some(this.seenSelectors, seen => seen === i.selector));
    }

    private startRefreshTimer() {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
        const source = interval(refreshTime);
        this.zone.runOutsideAngular(() => {
            this.refreshSubscription = source.subscribe(() => {
                this.zone.run(() => {
                    this.check();
                });
            });
        });
    }

    private loadSeenSelectors() {
        this.loadAndSaveSeenSelectorsService.load().subscribe(seenSelectors => {
            this.seenSelectors = seenSelectors;
        });
    }

    private saveSeenSelectors() {
        this.loadAndSaveSeenSelectorsService.save(this.seenSelectors);
    }

    private loadEnabledStatus() {
        this.loadAndSaveEnabledStatusService.load().subscribe(enabled => {
            this.enabled = enabled;
        });
    }

    private saveEnabledStatus() {
        this.loadAndSaveEnabledStatusService.save(this.enabled);
    }

}
