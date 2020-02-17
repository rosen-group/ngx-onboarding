import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingButtonComponent } from './onboarding-button.component';
import { OnboardingServiceMock } from './services/onboarding.service.mock';
import {PrimitiveTranslatePipe} from './pipes/primitive-translate.pipe';
import {OnboardingService} from './services/onboarding.service';
import {BrowserDOMSelectorService} from './services/browser-dom-selector.service';
import {BuildInTranslatorService} from './services/build-in-translator.service';
import {TranslatorBaseService} from './services/translator-base.service';
import {VisibleOnboardingItem} from './models/visible-onboarding-item.model';
import {MatButtonModule} from '@angular/material/button';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';

describe('OnboardingButtonComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatButtonModule,
                MatBadgeModule,
                MatMenuModule,
                MatIconModule],
            declarations: [
                PrimitiveTranslatePipe,
                OnboardingButtonComponent
            ],
            providers: [
                {provide: OnboardingService, useClass: OnboardingServiceMock},
                BrowserDOMSelectorService,
                {provide: TranslatorBaseService, useClass: BuildInTranslatorService}
            ]
        }).compileComponents();
    }));

    let fixture: ComponentFixture<OnboardingButtonComponent>;
    let component: OnboardingButtonComponent;

    beforeEach(() => {
        fixture = TestBed.createComponent(OnboardingButtonComponent);
        component = fixture.debugElement.componentInstance;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('showOnboardingItemCount returns true', () => {
        spyOn((component as any).onboardingService, 'isEnabled').and.returnValue(false);
        (component as any).onboardingService.visibleItems.add([
            new VisibleOnboardingItem()
        ]);

        expect(component.showOnboardingItemCount).toBeTruthy();
    });

    it('showOnboardingItemCount returns true', () => {
        spyOn((component as any).onboardingService, 'isEnabled').and.returnValue(true);
        (component as any).onboardingService.visibleItems.add([
            new VisibleOnboardingItem()
        ]);

        expect(component.showOnboardingItemCount).toBeFalsy();
    });

    it('showOnboardingItemCount returns false', () => {
        spyOn((component as any).onboardingService, 'isEnabled').and.returnValue(false);

        expect(component.showOnboardingItemCount).toBeFalsy();
    });

    it('onboardingItemCount returns false', () => {
        (component as any).onboardingService.visibleItems.add([
            new VisibleOnboardingItem(),
            new VisibleOnboardingItem(),
            new VisibleOnboardingItem()
        ]);

        expect(component.onboardingItemCount).toBe(3);
    });

    it('enableOnboarding expect onboardingService.enable to have been called', () => {
        const spy = spyOn((component as any).onboardingService, 'enable');

        component.enableOnboarding();

        expect(spy).toHaveBeenCalled();
    });

    it('disableOnboarding expect onboardingService.disable to have been called', () => {
        const spy = spyOn((component as any).onboardingService, 'disable');

        component.disableOnboarding();

        expect(spy).toHaveBeenCalled();
    });

    it('clearOnboarding expect onboardingService.clearSeenSelectors to have been called', () => {
        const spy = spyOn((component as any).onboardingService, 'clearSeenSelectors');

        component.clearOnboarding();

        expect(spy).toHaveBeenCalled();
    });

    it('isOnboardingEnabled expect to be true', () => {
        spyOn((component as any).onboardingService, 'isEnabled').and.returnValue(true);

        expect(component.isOnboardingEnabled()).toBe(true);
    });

    it('isOnboardingEnabled expect to be false', () => {
        spyOn((component as any).onboardingService, 'isEnabled').and.returnValue(false);

        expect(component.isOnboardingEnabled()).toBe(false);
    });

});
