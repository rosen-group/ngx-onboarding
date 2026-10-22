import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingComponent } from './onboarding.component';
import { OnboardingItemComponent } from './onboarding-item.component';
import { OnboardingServiceMock } from './services/onboarding.service.mock';
import { of } from 'rxjs';
import { PrimitiveTranslatePipe } from './pipes/primitive-translate.pipe';
import { OnboardingService } from './services/onboarding.service';
import { TranslatorBaseService } from './services/translator-base.service';
import { BuildInTranslatorService } from './services/build-in-translator.service';
import { BrowserDOMSelectorService } from './services/browser-dom-selector.service';
import { OnboardingHtmlElementHelper } from './models/onboarding-html-element-helper';
import { VisibleOnboardingItem } from './models/visible-onboarding-item.model';
import { OnboardingItem } from './models/onboarding-item.model';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

describe('OnboardingComponent', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatButtonModule,
                MatBadgeModule,
                MatMenuModule,
                MatIconModule,
                OnboardingItemComponent,
                PrimitiveTranslatePipe,
                OnboardingComponent
            ],
            providers: [
                { provide: OnboardingService, useClass: OnboardingServiceMock },
                BrowserDOMSelectorService,
                { provide: TranslatorBaseService, useClass: BuildInTranslatorService }
            ]
        }).compileComponents();
    });

    let fixture: ComponentFixture<OnboardingComponent>;
    let component: OnboardingComponent;

    beforeEach(() => {
        fixture = TestBed.createComponent(OnboardingComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit expect dynamicCss to be not empty', () => {
        component.dynamicCss = null as any;
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
        const spy = vi.spyOn((component as any).visibleItemsChangedSubscription, 'unsubscribe').mockReturnValue(undefined);

        component.ngOnDestroy();

        expect(spy).toHaveBeenCalled();
    });

    it('getPositionStyle expect return value.position to be fixed, ...', () => {
        vi.spyOn(OnboardingHtmlElementHelper, 'getPosition').mockReturnValue({
            x: 1,
            y: 2,
            width: 100,
            height: 200,
            fixed: false
        } as any);
        const value = component.getPositionStyle(document.createElement('div'));

        expect(value.position).toBe('fixed');
        expect(value.left).toBe('1px');
        expect(value.top).toBe('2px');
        expect(value.width).toBe('100px');
        expect(value.height).toBe('200px');
        expect(value.background).not.toBeDefined();
    });

    it('getPositionStyle expect return value.background to be transparent, ...', () => {
        vi.spyOn(OnboardingHtmlElementHelper, 'getPosition').mockReturnValue({
            x: 1,
            y: 2,
            width: 100,
            height: 200,
            fixed: true
        } as any);
        const value = component.getPositionStyle(document.createElement('div'));

        expect(value.position).toBe('fixed');
        expect(value.left).toBe('1px');
        expect(value.top).toBe('2px');
        expect(value.width).toBe('100px');
        expect(value.height).toBe('200px');
        expect(value.background).toBe('transparent');
    });

    it('isSpotlightTransparent expect return value to be false', () => {
        const value = component.isSpotlightTransparent({
            selector: '',
            headline: '',
            details: '',
            textAlign: 'center',
            position: '',
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
            descriptions: [],
            disableSpotlight: false,
            disableBackground: false,
            transparentSpotlight: true,
            toParent: false
        });

        expect(value).toBe(true);
    });

    it('disable expect hideItem called with each item and disabled called on onboardingService', () => {
        component.visibleItem = new VisibleOnboardingItem();
        const hideSpy = vi.spyOn(component as any, 'hideItem').mockReturnValue(undefined);
        const disableSpy = vi.spyOn(component.onboardingService, 'disable').mockReturnValue(undefined);

        component.disable();

        expect(hideSpy).toHaveBeenCalledWith(component.visibleItem);
        expect(disableSpy).toHaveBeenCalled();
    });

    it('showItem expect css class onboarding-highlighted and onboarding-highlighted-on-static to be set', () => {
        vi.spyOn(component.onboardingService, 'isEnabled').mockReturnValue(true);

        const item = new VisibleOnboardingItem(new OnboardingItem(), document.createElement('div'));

        (component as any).showItem(item);

        expect(item.element.classList.contains('onboarding-highlighted')).toBe(true);
        expect(item.element.classList.contains('onboarding-highlighted-on-static')).toBe(true);
    });

    it('showItem with position static expect css class onboarding-highlighted and onboarding-highlighted-on-static to be set', () => {
        vi.spyOn(component.onboardingService, 'isEnabled').mockReturnValue(true);

        const item = new VisibleOnboardingItem(new OnboardingItem(), document.createElement('div'));
        item.element.style.position = 'static';

        (component as any).showItem(item);

        expect(item.element.classList.contains('onboarding-highlighted')).toBe(true);
        expect(item.element.classList.contains('onboarding-highlighted-on-static')).toBe(true);
    });

    it('showItem with position relative expect css class onboarding-highlighted to be set', () => {
        vi.spyOn(component.onboardingService, 'isEnabled').mockReturnValue(true);

        const item = new VisibleOnboardingItem(new OnboardingItem(), document.createElement('div'));
        item.element.style.position = 'relative';

        (component as any).showItem(item);

        expect(item.element.classList.contains('onboarding-highlighted')).toBe(true);
        expect(item.element.classList.contains('onboarding-highlighted-on-static')).toBe(false);
    });

    it('hideItem expext classList.remove to be called twice', () => {
        const item = new VisibleOnboardingItem(new OnboardingItem(), document.createElement('div'));

        const spy = vi.spyOn(item.element.classList, 'remove').mockReturnValue(undefined);

        (component as any).hideItem(item);

        expect(spy).toHaveBeenCalledTimes(2);
    });

});
