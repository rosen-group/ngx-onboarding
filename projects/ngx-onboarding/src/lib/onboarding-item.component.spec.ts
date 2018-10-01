import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {OnboardingItemComponent} from './onboarding-item.component';
import {OnboardingService} from './services';
import {OnboardingServiceMock} from './services/onboarding.service.mock';
import {WindowRef} from './services/window-ref.service';
import {SeenSelectorsBaseService} from './services/seen-selectors-base.service';
import {MockLocalStorageSeenSelectorsService} from './services/local-storage-seen-selectors.service.mock';
import {OnboardingHtmlElementHelper, OnboardingItem, VisibleOnboardingItem} from './models';

describe('OnboardingItemComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                OnboardingItemComponent
            ],
            providers: [
                {provide: OnboardingService, useClass: OnboardingServiceMock},
                {provide: SeenSelectorsBaseService, useClass: MockLocalStorageSeenSelectorsService},
                WindowRef,
            ]
        }).compileComponents();
    }));

    let fixture: ComponentFixture<OnboardingItemComponent>;
    let component: OnboardingItemComponent;

    beforeEach(() => {
        fixture = TestBed.createComponent(OnboardingItemComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('getStyle with top', () => {
        spyOn(OnboardingHtmlElementHelper, 'getPosition').and.returnValue({
            x: 100,
            y: 200,
            width: 120,
            height: 60
        });
        component.item = new VisibleOnboardingItem(new OnboardingItem(), document.createElement('div'));
        component.item.item.position = 'top';

        const value = component.getStyle();

        expect(value.left).toBe('100px');
        expect(value.top).toBe('175px');
        expect(value.transform).toBe('translate(-50%,-100%)');
    });

    it('getStyle with right', () => {
        spyOn(OnboardingHtmlElementHelper, 'getPosition').and.returnValue({
            x: 100,
            y: 200,
            width: 120,
            height: 60
        });
        component.item = new VisibleOnboardingItem(new OnboardingItem(), document.createElement('div'));
        component.item.item.position = 'right';

        const value = component.getStyle();

        expect(value.left).toBe('125px');
        expect(value.top).toBe('200px');
        expect(value.transform).toBe('translateY(-50%)');
    });

    it('getStyle with left', () => {
        spyOn(OnboardingHtmlElementHelper, 'getPosition').and.returnValue({
            x: 100,
            y: 200,
            width: 120,
            height: 60
        });
        component.item = new VisibleOnboardingItem(new OnboardingItem(), document.createElement('div'));
        component.item.item.position = 'left';

        const value = component.getStyle();

        expect(value.left).toBe('75px');
        expect(value.top).toBe('200px');
        expect(value.transform).toBe('translate(-100%,-50%)');
    });

    it('getStyle with bottom', () => {
        spyOn(OnboardingHtmlElementHelper, 'getPosition').and.returnValue({
            x: 100,
            y: 200,
            width: 120,
            height: 60
        });
        component.item = new VisibleOnboardingItem(new OnboardingItem(), document.createElement('div'));
        component.item.item.position = 'bottom';

        const value = component.getStyle();

        expect(value.left).toBe('100px');
        expect(value.top).toBe('200px');
        expect(value.transform).toBe('translate(-50%,25%)');
    });

    it('getHeadline with locale a expect return value to be testHeadlineA', () => {
        component.item = new VisibleOnboardingItem(new OnboardingItem(), null);
        component.item.item.descriptions = [
            {
                language: 'a',
                details: 'testDetailsA',
                headline: 'testHeadlineA'
            },
            {
                language: 'b',
                details: 'testDetailsB',
                headline: 'testHeadlineB'
            }
        ];
        (component as any).locale = 'a';

        const headline = component.getHeadline();

        expect(headline).toBe('testHeadlineA');
    });

    it('getDetails with locale b expect return value to be testDetailsB', () => {
        component.item = new VisibleOnboardingItem(new OnboardingItem(), null);
        component.item.item.descriptions = [
            {
                language: 'a',
                details: 'testDetailsA',
                headline: 'testHeadlineA'
            },
            {
                language: 'b',
                details: 'testDetailsB',
                headline: 'testHeadlineB'
            }
        ];
        (component as any).locale = 'b';

        const headline = component.getDetails();

        expect(headline).toBe('testDetailsB');
    });

    it('getTextAlignClass expect return value to be empty', () => {
        component.item = new VisibleOnboardingItem(new OnboardingItem(), null);

        const value = component.getTextAlignClass();

        expect(value).toBe('');
    });

    it('getTextAlignClass with center expect return value to be empty', () => {
        component.item = new VisibleOnboardingItem(new OnboardingItem(), null);
        component.item.item.textAlign = 'center';

        const value = component.getTextAlignClass();

        expect(value).toBe('');
    });

    it('getTextAlignClass with left expect return value to be align-left', () => {
        component.item = new VisibleOnboardingItem(new OnboardingItem(), null);
        component.item.item.textAlign = 'left';

        const value = component.getTextAlignClass();

        expect(value).toBe('align-left');
    });

    it('getTextAlignClass with right expect return value to be align-right', () => {
        component.item = new VisibleOnboardingItem(new OnboardingItem(), null);
        component.item.item.textAlign = 'right';

        const value = component.getTextAlignClass();

        expect(value).toBe('align-right');
    });

});
