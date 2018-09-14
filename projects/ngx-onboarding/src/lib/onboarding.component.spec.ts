import { TestBed, async } from '@angular/core/testing';
import {OnboardingComponent} from './onboarding.component';
import {MatBadgeModule, MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {BrowserDOMSelectorService, OnboardingService, PrimitiveTranslatePipe, PrimitiveTranslateService} from './services';
import {OnboardingItemComponent} from './onboarding-item.component';
import {OnboardingServiceMock} from './services/onboarding.service.mock';

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
                {provide: OnboardingService, useClass: OnboardingServiceMock },
                BrowserDOMSelectorService,
                PrimitiveTranslateService]
        }).compileComponents();
    }));
    it('should create the component', async(() => {
        const fixture = TestBed.createComponent(OnboardingComponent);
        const component = fixture.debugElement.componentInstance;
        expect(component).toBeTruthy();
    }));
});
