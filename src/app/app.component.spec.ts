import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { OnboardingModule } from 'ngx-onboarding';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';


describe('AppComponent', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let errorHandler: ErrorHandler;
    beforeEach(() => {
        TestBed.configureTestingModule({
    declarations: [
        AppComponent
    ],
    imports: [OnboardingModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        errorHandler = TestBed.inject(ErrorHandler);
    });
    afterEach(() => {
        httpTestingController.verify();
    });
    it('should create the app and load onboarding data', () => {
        const errSpy = spyOn(errorHandler, 'handleError');
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeDefined();
        fixture.detectChanges();
        const req = httpTestingController.expectOne('assets/onboarding/example.json');
        req.flush(
            {
                'selector': '.css-class-1',
                'group': 'group 1',
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
            }
        );
        expect(errSpy).not.toHaveBeenCalled();

    });
});
