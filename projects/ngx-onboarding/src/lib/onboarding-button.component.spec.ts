import { TestBed, async } from '@angular/core/testing';
import {OnboardingButtonComponent} from './onboarding-button.component';
import {MatBadgeModule, MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {BrowserDOMSelectorService, OnboardingService, PrimitiveTranslatePipe, PrimitiveTranslateService} from './services';
import {OnboardingServiceMock} from './services/onboarding.service.mock';

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
                {provide: OnboardingService, useClass: OnboardingServiceMock },
                BrowserDOMSelectorService,
                PrimitiveTranslateService]
        }).compileComponents();
    }));
    it('should create the component', async(() => {
        const fixture = TestBed.createComponent(OnboardingButtonComponent);
        const component = fixture.debugElement.componentInstance;
        expect(component).toBeTruthy();
    }));
});
