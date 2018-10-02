import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingComponent } from './onboarding.component';
import { MatBadgeModule, MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';
import { BrowserDOMSelectorService, BuildInTranslatorService, OnboardingService, TranslatorBaseService } from './services';
import { OnboardingItemComponent } from './onboarding-item.component';
import { OnboardingServiceMock } from './services/onboarding.service.mock';
import { of } from 'rxjs';
import { OnboardingHtmlElementHelper, OnboardingItem, VisibleOnboardingItem } from './models';
import { PrimitiveTranslatePipe } from './pipes';

describe('OnboardingComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatButtonModule,
                MatBadgeModule,
                MatMenuModule,
                MatIconModule],
            declarations: [
                OnboardingItemComponent,
                PrimitiveTranslatePipe,
                OnboardingComponent
            ],
            providers: [
                {provide: OnboardingService, useClass: OnboardingServiceMock},
                BrowserDOMSelectorService,
                {provide: TranslatorBaseService, useClass: BuildInTranslatorService}
            ]
        }).compileComponents();
    }));

    let fixture: ComponentFixture<OnboardingComponent>;
    let component: OnboardingComponent;

    beforeEach(() => {
        fixture = TestBed.createComponent(OnboardingComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', async(() => {
        expect(component).toBeTruthy();
    }));

    it('ngOnInit expect dynamicCss to be not empty', () => {
        component.dynamicCss = null;
        (component as any).textConfig = {
            scriptFontFamily: 'testScriptFontFamily',
            regularFontFamily: 'testRegularFontFamily'
        };

        component.ngOnInit();

        expect(component.dynamicCss).toBeDefined();
        expect(component.dynamicCss.toString()).toContain('testScriptFontFamily');
        expect(component.dynamicCss.toString()).toContain('testRegularFontFamily');
    });

    it('ngAfterViewInit expect visibleItemsChangedSubscription to be defined', () => {
        (component as any).visibleItemsChangedSubscription = null;

        component.ngAfterViewInit();

        expect((component as any).visibleItemsChangedSubscription).toBeDefined();
    });

    it('ngOnDestroy expect visibleItemsChangedSubscription.unsubscribe to have been called', () => {
        (component as any).visibleItemsChangedSubscription = of(true).subscribe();
        const spy = spyOn((component as any).visibleItemsChangedSubscription, 'unsubscribe');

        component.ngOnDestroy();

        expect(spy).toHaveBeenCalled();
    });

    it('getPositionStyle expect return value.position to be fixed, ...', () => {
        spyOn(OnboardingHtmlElementHelper, 'getPosition').and.returnValue({
            x: 1,
            y: 2,
            width: 100,
            height: 200
        });
        const value = component.getPositionStyle(null);

        expect(value.position).toBe('fixed');
        expect(value.left).toBe('1px');
        expect(value.top).toBe('2px');
        expect(value.width).toBe('100px');
        expect(value.height).toBe('200px');
    });

    it('isSpotlightTransparent expect return value to be false', () => {
        const value = component.isSpotlightTransparent({
            selector: '',
            headline: '',
            details: '',
            textAlign: 'center',
            position: '',
            group: '',
            descriptions: [],
            disableSpotlight: false,
            disableBackground: false,
            transparentSpotlight: false,
            toParent: false
        });

        expect(value).toBe(false);
    });

    it('isSpotlightTransparent expect return value to be true', () => {
        const value = component.isSpotlightTransparent({
            selector: '',
            headline: '',
            details: '',
            textAlign: 'center',
            position: '',
            group: '',
            descriptions: [],
            disableSpotlight: false,
            disableBackground: false,
            transparentSpotlight: true,
            toParent: false
        });

        expect(value).toBe(true);
    });

    it('disable expect hideItem called with each item and disabled called on onboardingService', () => {
        component.items = [
            new VisibleOnboardingItem()
        ];
        const hideSpy = spyOn(component as any, 'hideItem');
        const disableSpy = spyOn(component.onboardingService, 'disable');

        component.disable();

        expect(hideSpy).toHaveBeenCalledWith(component.items[0]);
        expect(disableSpy).toHaveBeenCalled();
    });

    it('showItem expect css class onboarding-highlighted and onboarding-highlighted-on-static to be set', () => {
        spyOn(component.onboardingService, 'isEnabled').and.returnValue(true);

        const item = new VisibleOnboardingItem(new OnboardingItem(), document.createElement('div'));

        (component as any).showItem(item);

        expect(item.element.classList.contains('onboarding-highlighted')).toBe(true);
        expect(item.element.classList.contains('onboarding-highlighted-on-static')).toBe(true);
    });

    it('showItem with position static expect css class onboarding-highlighted and onboarding-highlighted-on-static to be set', () => {
        spyOn(component.onboardingService, 'isEnabled').and.returnValue(true);

        const item = new VisibleOnboardingItem(new OnboardingItem(), document.createElement('div'));
        item.element.style.position = 'static';

        (component as any).showItem(item);

        expect(item.element.classList.contains('onboarding-highlighted')).toBe(true);
        expect(item.element.classList.contains('onboarding-highlighted-on-static')).toBe(true);
    });

    it('showItem with position relative expect css class onboarding-highlighted to be set', () => {
        spyOn(component.onboardingService, 'isEnabled').and.returnValue(true);

        const item = new VisibleOnboardingItem(new OnboardingItem(), document.createElement('div'));
        item.element.style.position = 'relative';

        (component as any).showItem(item);

        expect(item.element.classList.contains('onboarding-highlighted')).toBe(true);
        expect(item.element.classList.contains('onboarding-highlighted-on-static')).toBe(false);
    });

    it('hideItem expext classList.remove to be called twice', () => {
        const item = new VisibleOnboardingItem(new OnboardingItem(), document.createElement('div'));

        const spy = spyOn(item.element.classList, 'remove');

        (component as any).hideItem(item);

        expect(spy).toHaveBeenCalledTimes(2);
    });

});
