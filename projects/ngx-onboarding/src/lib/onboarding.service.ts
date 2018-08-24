import {OnboardingItem} from './models/onboarding-item.model';
import {interval, Observable, Subscription, timer} from 'rxjs';
import {EventEmitter, Injectable, NgZone} from '@angular/core';
import * as _ from 'lodash';
import {VisibleOnboardingItem} from './models/visible-onboarding-item.model';
import {OnboardingItemContainer} from './models/onboarding-item-container.model';
import {HtmlElementHelper} from './models/onboarding-html-helper';
import {BrowserDOMSelectorService} from './models/browser-dom-selector.service';

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
@Injectable()
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

    constructor(private browserDomSelectorService: BrowserDOMSelectorService, private zone: NgZone) {
        this.init();
    }

    /**
     * called by OnboardingComponent, HeaderComponent
     */
    public get registeredItemsCount(): number {
        return this.items.length;
    }

    /**
     * registers [[OnboardingItem]]s in items, returns the method to unregister items (e.g. in ngOnDestroy)
     */
    public register(items: Array<OnboardingItem>): () => void {
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
        if (this.isEnabled() && this.visibleItems && this.visibleItems.curLength > 0) { return; }
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
        if (this.addSeenSelectorDebounceSubscription) { this.addSeenSelectorDebounceSubscription.unsubscribe(); }
        const source = timer(AddSeenSelectorDebounceTime);
        this.addSeenSelectorDebounceSubscription = source.subscribe(() => {
            this.saveSeenSelectorsToUserSettings();
        });
    }

    private loadSeenSelectorsFromUserSettings(): void {
        const errorDummy = new Error('OnboardingService.loadSeenSelectorsFromUserSettings()');
        if (this.loadSettingsBusy) { this.loadSettingsBusy.unsubscribe(); }
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
        if (this.enabledChangedDebounceSubscription) { this.enabledChangedDebounceSubscription.unsubscribe(); }
        const source = timer(EnabledChangedDebounceTime);
        this.enabledChangedDebounceSubscription = source.subscribe(() => {
            this.saveEnabledUserSetting();
        });
    }

    private loadEnabledFromUserSetting(): void {
        // if (this.loadEnabledSettingBusy) { this.loadEnabledSettingBusy.unsubscribe(); }
        // this.loadEnabledSettingBusy = this.settingsService.getSetting(EnabledUserSettingsUniqueKey).subscribe(setting => {
        //     this.enabled = setting && setting.data ? setting.data == 'true' : true;
        // }, () => {
        //     this.loggingService.info('OnboardingService.loadEnabledFromUserSetting failed. Set enabled to true.', 'rolibjs');
        //     this.enabled = true;
        // });
    }

    private saveEnabledUserSetting(): void {
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
      const groupItems = filterByGroupPattern ? _.filter(this.items, i => new RegExp(filterByGroupPattern, 'i').test(i.group)) : this.items;
      return _.filter(groupItems, i => !_.some(this.seenSelectors, seen => seen === i.selector));
    }

    private startRefreshTimer() {
        if (this.refreshSubscription) { this.refreshSubscription.unsubscribe(); }
        this.zone.runOutsideAngular(() => {
            const source = interval(RefreshTime);
            this.refreshSubscription = source.subscribe(() => {
                this.zone.run(() => {
                    this.check();
                });
            });
        });
    }


}
