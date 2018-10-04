import {async, inject, TestBed} from '@angular/core/testing';
import {OnboardingService} from './onboarding.service';
import {BrowserDOMSelectorService} from './browser-dom-selector.service';
import {OnboardingItem} from '../models';
import {SeenSelectorsBaseService} from './seen-selectors-base.service';
import {MockLocalStorageSeenSelectorsService} from './local-storage-seen-selectors.service.mock';
import {MockLocalStorageEnabledStatusService} from './local-storage-enabled-status.service.mock';
import {EnabledStatusBaseService} from './enabled-status-base.service';

describe('OnboardingService', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                BrowserDOMSelectorService,
                OnboardingService,
                {provide: SeenSelectorsBaseService, useClass: MockLocalStorageSeenSelectorsService},
                {provide: EnabledStatusBaseService, useClass: MockLocalStorageEnabledStatusService}
            ],
        });
    }));

    it('should be created', inject([OnboardingService], (service: OnboardingService) => {
        expect(service).toBeTruthy();
    }));

    it('call check expects visibleItems.length to be 0',
        inject([OnboardingService, BrowserDOMSelectorService],
            (onboardingService: OnboardingService, browserDomSelectorService: BrowserDOMSelectorService) => {
                spyOn(browserDomSelectorService, 'querySelectorAll').and.returnValue([]);
                spyOn(onboardingService.visibleItemsChanged, 'emit');
                onboardingService.register(getOnboardingItems());
                onboardingService.visibleItems.clear();
                onboardingService['enabled'] = true;

                onboardingService.check();

                expect(browserDomSelectorService.querySelectorAll).toHaveBeenCalledTimes(6);
                expect(onboardingService.visibleItemsChanged.emit).toHaveBeenCalled();
                expect(onboardingService.visibleItems.currentLength).toBe(0);
            }));

    it('call check expects visibleItems.length to be 2',
        inject([OnboardingService, BrowserDOMSelectorService],
            (onboardingService: OnboardingService, browserDomSelectorService: BrowserDOMSelectorService) => {
                spyOn(browserDomSelectorService, 'querySelectorAll').and.callFake(() => {
                    return getHtmlElements(6);
                });
                onboardingService['items'] = getOnboardingItems();
                onboardingService.visibleItems.clear();
                expect(onboardingService.visibleItems.isEmpty).toBeTruthy();
                onboardingService['seenSelectors'] = [];
                onboardingService['enabled'] = true;

                onboardingService.check('group 2');

                expect(browserDomSelectorService.querySelectorAll).toHaveBeenCalledTimes(2);
                expect(onboardingService.visibleItems.currentLength).toBe(2);
                expect(onboardingService.visibleItems.isEmpty).toBeFalsy();
            }));

    it('call register expects items.lenght to be 6', inject([OnboardingService], (onboardingService: OnboardingService) => {
        const unregister = onboardingService.register(getOnboardingItems());
        expect(onboardingService['items'].length).toBe(6);
        unregister();
        expect(onboardingService['items'].length).toBe(0);
    }));

    it('call check expects visibleItems to contain 3x arrays with 2 items each when grouping sortOrder',
        inject([OnboardingService, BrowserDOMSelectorService],
            (onboardingService: OnboardingService, browserDomSelectorService: BrowserDOMSelectorService) => {
                spyOn(browserDomSelectorService, 'querySelectorAll').and.callFake(() => {
                    return getHtmlElements(6);
                });
                onboardingService['items'] = getOnboardingItems(true);
                onboardingService.visibleItems.clear();
                onboardingService['seenSelectors'] = [];
                onboardingService['enabled'] = true;

                onboardingService.check();

                expect(browserDomSelectorService.querySelectorAll).toHaveBeenCalledTimes(6);

                expect(onboardingService.visibleItems.totalLength).toBe(6);
                expect(onboardingService.visibleItems.currentLength).toBe(2);
                expect(onboardingService.visibleItems.hasNext).toBe(true);

                // go to next group
                onboardingService.visibleItems.nextItems();

                expect(onboardingService.visibleItems.totalLength).toBe(6);
                expect(onboardingService.visibleItems.currentLength).toBe(2);
                expect(onboardingService.visibleItems.hasNext).toBe(true);

                // go to next group
                onboardingService.visibleItems.nextItems();

                expect(onboardingService.visibleItems.totalLength).toBe(6);
                expect(onboardingService.visibleItems.currentLength).toBe(2);
                expect(onboardingService.visibleItems.hasNext).toBe(false);

                // go to next group
                expect(onboardingService.visibleItems.nextItems().length).toBe(0);

            }));

    it('call disable expects isEnabled to be false and enableChanged to have been called',
        inject([OnboardingService], (onboardingService: OnboardingService) => {
            spyOn(onboardingService as any, 'enabledChanged');
            onboardingService['enabled'] = true;

            onboardingService.disable();

            expect(onboardingService.isEnabled()).toBe(false);
            expect(onboardingService['enabledChanged']).toHaveBeenCalled();
        }));

    it('call enable expects isEnabled to be false and enableChanged to have been called',
        inject([OnboardingService], (onboardingService: OnboardingService) => {
            spyOn(onboardingService as any, 'enabledChanged');
            onboardingService['enabled'] = false;

            onboardingService.enable();

            expect(onboardingService.isEnabled()).toBe(true);
            expect(onboardingService['enabledChanged']).toHaveBeenCalled();
        }));

    it('call clearSeenSelectors expects seenSelectors.lenght to be 0 and seenSelectorsChanged to have been called',
        inject([OnboardingService], (onboardingService: OnboardingService) => {
            spyOn(onboardingService as any, 'seenSelectorsChanged');
            onboardingService['seenSelectors'] = ['.a', '.b'];

            onboardingService.clearSeenSelectors();

            expect(onboardingService['seenSelectors'].length).toBe(0);
            expect(onboardingService['seenSelectorsChanged']).toHaveBeenCalled();
        }));

    it('call addToSeenSelectors expects seenSelectors.lenght to be 3 and seenSelectorsChanged to have been called',
        inject([OnboardingService], (onboardingService: OnboardingService) => {
            spyOn(onboardingService as any, 'seenSelectorsChanged');
            onboardingService['seenSelectors'] = ['.a', '.b'];

            onboardingService['addToSeenSelectors']('.test-selector');

            expect(onboardingService['seenSelectors'].length).toBe(3);
            expect(onboardingService['seenSelectorsChanged']).toHaveBeenCalled();
        }));

    it('call seenSelectorsChanged expects saveSeenSelectorsToUserSettings to have been called', done => {
        inject([OnboardingService], (onboardingService: OnboardingService) => {
            const spy = spyOn(onboardingService as any, 'saveSeenSelectors').and.stub();

            onboardingService['seenSelectorsChanged']();

            setTimeout(() => {
                expect(spy).toHaveBeenCalled();
                done();
            }, 1001);

        })();
    });

    const getOnboardingItems: (boolean?) => Array<OnboardingItem> = (ordered: boolean = false) => {
        return [
            {
                'selector': '.css-class-1',
                'group': 'group 1' + (ordered ? 1 : 0),
                'position': 'top',
                'headline': 'headline 1',
                'details': 'details 1',
                'descriptions': [
                    {
                        'language': 'de',
                        'headline': 'headline 1 de',
                        'details': 'details 1 de'
                    }
                ]
            } as OnboardingItem, {
                'selector': '.css-class-2',
                'group': 'group 1' + (ordered ? 1 : 0),
                'position': 'bottom',
                'headline': 'headline 2',
                'details': 'details 2',
                'descriptions': [
                    {
                        'language': 'de',
                        'headline': 'headline 2 de',
                        'details': 'details 2 de'
                    }
                ]
            } as OnboardingItem, {
                'selector': '.css-class-3',
                'group': 'group 1' + (ordered ? 2 : 0),
                'position': 'left',
                'headline': 'headline 3',
                'details': 'details 3',
                'descriptions': [
                    {
                        'language': 'de',
                        'headline': 'headline 3 de',
                        'details': 'details 3 de'
                    }
                ]
            } as OnboardingItem, {
                'selector': '.css-class-4',
                'group': 'group 1' + (ordered ? 2 : 0),
                'position': 'right',
                'headline': 'headline 4',
                'details': 'details 4',
                'descriptions': [
                    {
                        'language': 'de',
                        'headline': 'headline 4 de',
                        'details': 'details 4 de'
                    }
                ]
            } as OnboardingItem, {
                'selector': '.css-class-5',
                'group': 'group 2' + (ordered ? 3 : 0),
                'position': 'top',
                'headline': 'headline 5',
                'details': 'details 5',
                'descriptions': [
                    {
                        'language': 'de',
                        'headline': 'headline 5 de',
                        'details': 'details 5 de'
                    }
                ]
            } as OnboardingItem, {
                'selector': '.css-class-6',
                'group': 'group 2' + (ordered ? 3 : 0),
                'position': 'bottom',
                'headline': 'headline 6',
                'details': 'details 6',
                'descriptions': [
                    {
                        'language': 'de',
                        'headline': 'headline 6 de',
                        'details': 'details 6 de'
                    }
                ]
            } as OnboardingItem
        ];
    };

    const getHtmlElements = (count: number) => {
        const elements = [];
        for (let i = 0; i < count; i++) {
            const element = document.createElement('div');
            element.classList.add('css-class-' + (i + 1));
            elements.push(element);
        }
        return elements;
    };
});
