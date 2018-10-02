import { interval, Subscription, timer } from 'rxjs';
import { ErrorHandler, EventEmitter, Injectable, NgZone } from '@angular/core';
import * as _ from 'lodash';
import { BrowserDOMSelectorService } from './browser-dom-selector.service';
import {
    OnboardingConfiguration,
    OnboardingHtmlElementHelper,
    OnboardingItem,
    OnboardingItemContainer,
    VisibleOnboardingItem
} from '../models';
import { SeenSelectorsBaseService } from './seen-selectors-base.service';
import { EnabledStatusBaseService } from './enabled-status-base.service';
import { NgxUidService } from 'ngx-uid';

const addSeenSelectorDebounceTime = 1000;
const enabledChangedDebounceTime = 1000;
const refreshTime = 2000;


/**
 * The OnboardingService manages the configuration and the status of the onboarding component.
 *
 * The OnboardingComponent listens to the visibleItemsChanged event and retrieves new onboarding items from the visibleItems object.
 */
@Injectable({
    providedIn: 'root'
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
    public readonly instanceId: string;
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
        }
    };

    constructor(private browserDomSelectorService: BrowserDOMSelectorService,
                private loadAndSaveSeenSelectorsService: SeenSelectorsBaseService,
                private loadAndSaveEnabledStatusService: EnabledStatusBaseService,
                private errorHandler: ErrorHandler,
                private zone: NgZone,
                uidService: NgxUidService) {
        this.instanceId = uidService.next();
        this.configuration = this.defaultConfiguration;
        /* this is the default setting. can be changed by configure()*/
        this.init();
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
            textConfiguration: Object.assign({}, this.defaultConfiguration.textConfiguration)
        };

        if (configuration.iconConfiguration) {
            Object.assign(
                mergedConfig.iconConfiguration,
                configuration.iconConfiguration
            );
        }

        if (configuration.textConfiguration) {
            Object.assign(
                mergedConfig.textConfiguration,
                configuration.textConfiguration
            );
        }

        // icon shape configurations are mutually exclusive so a special checks are needed for that
        if (!configuration.iconConfiguration.matIconName &&
            (configuration.iconConfiguration.fontSet || configuration.iconConfiguration.svgIcon)
        ) {
            mergedConfig.iconConfiguration.matIconName = undefined; // if the user wants fontSet than we have to disable matIconName
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
            this.items = _.filter(this.items, thisItem => !_.some(items, item => thisItem.selector === item.selector));
        };
    }

    /**
     * Check which onboarding items are visible. Emit visibleItemsChanged event.
     * called by OnboardingComponent
     * @param filterGroupBy Regex pattern to filter onboarding items by group name
     */
    public check(filterGroupBy: string = null) {
        try {
            if (this.isEnabled() && this.visibleItems && this.visibleItems.currentLength > 0) {
                return;
            }
            const matches: Array<VisibleOnboardingItem> = [];
            const groupItems = this.getItems(filterGroupBy);
            if (groupItems) {
                _.each(groupItems, groupItem => {
                    const elements = this.browserDomSelectorService.querySelectorAll(groupItem.selector);
                    if (elements && elements.length > 0) {
                        let element: HTMLElement = _.find(
                            elements, (e: HTMLElement) => OnboardingHtmlElementHelper.isVisibleInViewWithParents(e)
                        );
                        if (element) {
                            if (groupItem.toParent && element.offsetParent) {
                                element = <HTMLElement>element.offsetParent;
                            }
                            if (element) {
                                matches.push({
                                    item: groupItem,
                                    element: element
                                });
                            }
                        }
                    }
                });
            }

            this.visibleItems.clear();
            this.evalAndAddGroups(matches);
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

        _.each(this.visibleItems.allItems, i => {
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

    /**
     * Evaluate group and add grouped items to visible items container
     */
    private evalAndAddGroups(input: Array<VisibleOnboardingItem>) {
        const tmpDic = _.groupBy(input, x => x.item.group || undefined);

        for (const g of Object.getOwnPropertyNames(tmpDic).sort()) {
            const v = tmpDic[g] as Array<VisibleOnboardingItem>;
            this.visibleItems.add(v);
        }
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


    /**
     * Get candidates for visible items
     * @param filterByGroupPattern Regex pattern to filter candidates by group name
     */
    private getItems(filterByGroupPattern: string = null): Array<OnboardingItem> {
        const groupItems: Array<OnboardingItem> = filterByGroupPattern ?
            _.filter(this.items, i => new RegExp(filterByGroupPattern, 'i')
                .test(i.group)) : this.items;
        return _.filter(groupItems, i => !_.some(this.seenSelectors, seen => seen === i.selector));
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
            this.enabled = true;
        });
    }

    private saveEnabledStatus() {
        this.loadAndSaveEnabledStatusService.save(this.enabled);
    }

}
