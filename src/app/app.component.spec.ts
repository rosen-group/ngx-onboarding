import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { OnboardingModule, OnboardingComponent, OnboardingButtonComponent, SeenSelectorsBaseService, EnabledStatusBaseService, TranslatorBaseService } from 'ngx-onboarding';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
// AppComponent is not standalone; its AOT compilation scope comes from AppModule, which must be part of the program.
import './app.module';
import { LocalStorageSeenSelectorsService } from '../../projects/ngx-onboarding/src/lib/services/local-storage-seen-selectors.service';
import { LocalStorageEnabledStatusService } from '../../projects/ngx-onboarding/src/lib/services/local-storage-enabled-status.service';
import { BuildInTranslatorService } from '../../projects/ngx-onboarding/src/lib/services/build-in-translator.service';


describe('AppComponent', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let errorHandler: ErrorHandler;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            imports: [OnboardingModule, OnboardingComponent, OnboardingButtonComponent],
            providers: [
                provideHttpClient(withXhr(), withInterceptorsFromDi()),
                provideHttpClientTesting(),
                { provide: SeenSelectorsBaseService, useClass: LocalStorageSeenSelectorsService },
                { provide: EnabledStatusBaseService, useClass: LocalStorageEnabledStatusService },
                { provide: TranslatorBaseService, useClass: BuildInTranslatorService }
            ]
        });
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
        errorHandler = TestBed.inject(ErrorHandler);
    });
    afterEach(() => {
        httpTestingController.verify();
    });
    it('should create the app and load onboarding data', () => {
        const errSpy = vi.spyOn(errorHandler, 'handleError').mockReturnValue(undefined);
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeDefined();
        fixture.detectChanges();
        const req = httpTestingController.expectOne('assets/onboarding/example.json');
        req.flush([{
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
        }]);
        expect(errSpy).not.toHaveBeenCalled();

    });
});
