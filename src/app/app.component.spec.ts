import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {OnboardingModule, OnboardingService} from '../../projects/ngx-onboarding/src';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {OnboardingServiceMock} from '../../projects/ngx-onboarding/src/lib/services/onboarding.service.mock';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [OnboardingModule, HttpClientTestingModule],
            declarations: [
                AppComponent
            ],
            providers: [
                {provide: OnboardingService, useClass: OnboardingServiceMock}
            ]
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        // TODO fix test - Error: Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
