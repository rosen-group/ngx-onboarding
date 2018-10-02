import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingButtonComponent } from './onboarding-button.component';
import { MatBadgeModule, MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';
import { BrowserDOMSelectorService, BuildInTranslatorService, OnboardingService, TranslatorBaseService } from './services';
import { OnboardingServiceMock } from './services/onboarding.service.mock';
import { VisibleOnboardingItem } from './models';
import { PrimitiveTranslatePipe } from './pipes';

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
