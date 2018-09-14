import { TestBed, async } from '@angular/core/testing';
import {OnboardingItemComponent} from './onboarding-item.component';
import {BrowserDOMSelectorService, OnboardingService, PrimitiveTranslateService} from './services';
import {OnboardingServiceMock} from './services/onboarding.service.mock';

describe('OnboardingItemComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                OnboardingItemComponent
            ],
            providers: [
                {provide: OnboardingService, useClass: OnboardingServiceMock }
                ]
        }).compileComponents();
    }));
    it('should create the component', async(() => {
        const fixture = TestBed.createComponent(OnboardingItemComponent);
        const component = fixture.debugElement.componentInstance;
        expect(component).toBeTruthy();
    }));
});
