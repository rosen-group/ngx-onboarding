import {Component, ErrorHandler, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {OnboardingItem, OnboardingService} from '../../projects/ngx-onboarding/src';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'ngx-onboarding-app';
    infoMessage = '';
    private unregisterOnboarding: Function;

    constructor(private onboardingService: OnboardingService,
                private httpClient: HttpClient,
                private errorHandler: ErrorHandler) {
    }

    ngOnInit() {
        this.loadAndRegisterOnboardingData();
    }

    private loadAndRegisterOnboardingData() {
        this.httpClient.get('assets/onboarding/app.json').subscribe((data) => {
            const arr = data as Array<OnboardingItem>;
            this.unregisterOnboarding = this.onboardingService.register(arr);
        }, (error) => {
            this.infoMessage = `Onboarding: ${this.formatError(error)}`;
            this.errorHandler.handleError(error);
        });
    }

    ngOnDestroy() {
        if (this.unregisterOnboarding) {
            this.unregisterOnboarding();
        }
    }

    private formatError(error: any): string {
        if (typeof error === 'string') {
            return error;
        }
        if (typeof error === 'object') {
            let res = '';
            if (error.constructor && error.constructor.name) {
                res += `[${error.constructor.name}] `;
            }
            if (error.message) {
                res += error.message;
            }

            return res.length > 0 ? res : error;
        }
        return error;
    }

}
