import { interval, Subscription, timer } from 'rxjs';
import { EventEmitter, Injectable } from '@angular/core';
import * as _ from 'lodash';

import { BrowserDOMSelectorService } from './browser-dom-selector.service';
import { HtmlElementHelper, OnboardingConfiguration, OnboardingItem, OnboardingItemContainer, VisibleOnboardingItem } from '../models';

const UserSettingsUniqueKey = '894ae732-b4bd-45c9-b543-6f9c5c5a86b6';
const UserSettingsVersion = '1';
const EnabledUserSettingsUniqueKey = '42cfe10a-c2d3-42ba-9c55-6198545a0c49';
const EnabledUserSettingsVersion = '1';
const AddSeenSelectorDebounceTime = 1000;
const EnabledChangedDebounceTime = 1000;
const RefreshTime = 2000;


/**
 * OnboardingService:
 * The OnboardingService manages unseen onboarding items.
 *
 * The OnboardingComponent listens to the visibleItemsChanged event and retrieves new onboarding items from the visibleItems object.
 */
@Injectable({providedIn: 'root'})
export class OnboardingService {

    /**
     * Container with currently visible onboarding items (grouped).
     * OnboardingComponent must iterate through theese groups.
     *
     * called by OnboardingComponent
     */
    public readonly visibleItems = new OnboardingItemContainer();
    /**
     * called by OnboardingComponent
     */
    public visibleItemsChanged = new EventEmitter();
    private addSeenSelectorDebounceSubscription: Subscription;
    private loadSettingsBusy: Subscription;
    private saveSettingsBusy: Subscription;
    private enabledChangedDebounceSubscription: Subscription;
    private loadEnabledSettingBusy: Subscription;
    private saveEnabledSettingBusy: Subscription;
    private refreshSubscription: Subscription;
    private items: Array<OnboardingItem>;
    private seenSelectors: Array<string>;
    private enabled: boolean;
    public readonly instanceId: string;
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

    constructor(private browserDomSelectorService: BrowserDOMSelectorService) {
        this.instanceId = makeuuid();
        this.configuration = this.defaultConfiguration;
        /* this is the default setting. can be changed by configure()*/
        this.init();
    }

    /**
     * called by OnboardingComponent, HeaderComponent
     */
    public get registeredItemsCount(): number {
        return this.items.length;
    }

    /**
     * call this in your module where you import this service as provider and set global defaults like icon properties
     */
    public configure(configuration: OnboardingConfiguration) {
        if (typeof configuration === 'undefined') {
            throw new Error('Configuration must not be undefined or null');
        }
        // new merge default configurationm with user configuration
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

    /** used internall only to retrive to configuration from configure()*/
    public getConfiguration() {
        return this.configuration;
    }

    /**
     * registers [[OnboardingItem]]s in items, returns the method to unregister items (e.g. in ngOnDestroy)
     */
    public register(items: Array<OnboardingItem>): Function {
        this.items.push(...items);
        return () => {
            this.items = _.filter(this.items, i => !_.some(items, j => i.selector === j.selector));
        };
    }

    /**
     * Check which onboarding items are visible. Emit visibleItemsChanged event.
     * called by OnboardingComponent
     * @param filterGroupBy Regex pattern to filter onboarding items by group name
     */
    public check(filterGroupBy: string = null) {
        try {
            if (this.isEnabled() && this.visibleItems && this.visibleItems.curLength > 0) {
                return;
            }
            const matches: Array<VisibleOnboardingItem> = [];
            const groupItems = this.getItems(filterGroupBy);
            if (groupItems) {
                _.each(groupItems, i => {
                    const eles = this.browserDomSelectorService.querySelectorAll(i.selector);
                    if (eles && eles.length > 0) {
                        let ele: HTMLElement = _.find(eles, (e: HTMLElement) => HtmlElementHelper.isVisibleInViewWithParents(e));
                        if (ele) {
                            if (i.toParent && ele.offsetParent) {
                                ele = <HTMLElement>ele.offsetParent;
                            }
                            if (ele) {
                                matches.push({
                                    item: i,
                                    ele: ele
                                });
                            }
                        }
                    }
                });
            }

            this.visibleItems.clear();
            this.evalAndAddGroups(matches);
            this.visibleItemsChanged.emit();
        } catch (e) {
            console.error(e);
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
     */
    public disable() {
        this.hide();
        this.enabled = false;
        this.visibleItemsChanged.emit();
        this.enabledChanged();
    }

    /**
     * called by OnboardingComponent
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
        this.loadSeenSelectorsFromUserSettings();
        this.loadEnabledFromUserSetting();
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
        const source = timer(AddSeenSelectorDebounceTime);
        this.addSeenSelectorDebounceSubscription = source.subscribe(() => {
            this.saveSeenSelectorsToUserSettings();
        });
    }

    private loadSeenSelectorsFromUserSettings(): void {
        const userSettings = localStorage.getItem(UserSettingsUniqueKey);
        if (!_.isEmpty(userSettings)) {
            try {
                this.seenSelectors = JSON.parse(userSettings);
            } catch (err) {
                console.error(err);
            }
        }
        // const errorDummy = new Error('OnboardingService.loadSeenSelectorsFromUserSettings()');
        // if (this.loadSettingsBusy) {
        //     this.loadSettingsBusy.unsubscribe();
        // }
        // this.loadSettingsBusy = this.settingsService.getSetting(UserSettingsUniqueKey).subscribe(userSettings => {
        //     this.seenSelectors = [];
        //     if (userSettings) {
        //         try {
        //             this.seenSelectors = JSON.parse(userSettings.data);
        //         } catch (err) {
        //             this.loggingService.error(err, 'time', errorDummy, 'failed to parse seen selectors');
        //         }
        //     }
        // });
    }

    private saveSeenSelectorsToUserSettings(): void {

        localStorage.setItem(UserSettingsUniqueKey, JSON.stringify(this.seenSelectors));
        // const errorDummy = new Error('OnboardingService.saveSeenSelectorsToUserSettings()');
        // const userSettings = new UserSetting(UserSettingsUniqueKey);
        // userSettings.version = UserSettingsVersion;
        // userSettings.data = JSON.stringify(this.seenSelectors);
        // if (this.saveSettingsBusy) { this.saveSettingsBusy.unsubscribe(); }
        // this.saveSettingsBusy = this.settingsService.setSetting(userSettings).subscribe(() => {
        // }, err => {
        //     this.loggingService.error(err, 'rolibjs', errorDummy);
        //     this.dialogService.showError('{{ONBOARDING_FAILED_TO_SAVE_USER_SETTINGS}}', '{{DIALOGS_ERROR}}', err);
        // });
    }

    private enabledChanged() {
        if (this.enabledChangedDebounceSubscription) {
            this.enabledChangedDebounceSubscription.unsubscribe();
        }
        const source = timer(EnabledChangedDebounceTime);
        this.enabledChangedDebounceSubscription = source.subscribe(() => {
            this.saveEnabledUserSetting();
        });
    }

    private loadEnabledFromUserSetting(): void {
        this.enabled = ('true' === localStorage.getItem(EnabledUserSettingsUniqueKey));
        // if (this.loadEnabledSettingBusy) { this.loadEnabledSettingBusy.unsubscribe(); }
        // this.loadEnabledSettingBusy = this.settingsService.getSetting(EnabledUserSettingsUniqueKey).subscribe(setting => {
        //     this.enabled = setting && setting.data ? setting.data == 'true' : true;
        // }, () => {
        //     this.loggingService.info('OnboardingService.loadEnabledFromUserSetting failed. Set enabled to true.', 'rolibjs');
        //     this.enabled = true;
        // });
    }

    private saveEnabledUserSetting(): void {
        localStorage.setItem(EnabledUserSettingsUniqueKey, this.enabled ? 'true' : 'false');
        // const errorDummy = new Error('OnboardingService.saveEnabledUserSetting()');
        // const userSettings = new UserSetting(EnabledUserSettingsUniqueKey);
        // userSettings.version = EnabledUserSettingsVersion;
        // userSettings.data = this.enabled ? 'true' : 'false';
        // if (this.saveEnabledSettingBusy) { this.saveEnabledSettingBusy.unsubscribe(); }
        // this.saveEnabledSettingBusy = this.settingsService.setSetting(userSettings).subscribe(() => {
        // }, err => {
        //     this.loggingService.error(err, 'rolibjs', errorDummy);
        //     this.dialogService.showError('{{ONBOARDING_FAILED_TO_LOAD_SAVE_SETTINGS}}', '{{DIALOGS_ERROR}}', err);
        // });
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
        const source = interval(RefreshTime);
        this.refreshSubscription = source.subscribe(() => {
            this.check();
        });
    }


}


/** generate unique id (like GUID) */
export function makeuuid(): string {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
