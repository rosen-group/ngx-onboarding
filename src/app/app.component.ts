import {Component, ErrorHandler, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {OnboardingService} from "../../projects/ngx-onboarding/src/lib/services/onboarding.service";
import {OnboardingItem} from "../../projects/ngx-onboarding/src/lib/models/onboarding-item.model";

/**
 * Example component to test the onboarding component
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'ngx-onboarding-app';
    infoMessage = '';
    private unregisterOnboarding: Function;

    public popupVisible: boolean = false;

    constructor(private onboardingService: OnboardingService,
                private httpClient: HttpClient,
                private errorHandler: ErrorHandler) {
    }

    public ngOnInit() {
        this.loadAndRegisterOnboardingData();
    }

    public ngOnDestroy() {
        if (this.unregisterOnboarding) {
            this.unregisterOnboarding();
        }
    }

    private loadAndRegisterOnboardingData() {
        this.httpClient.get('assets/onboarding/example.json').subscribe((onboardingItems: Array<OnboardingItem>) => {
            this.unregisterOnboarding = this.onboardingService.register(onboardingItems);
        }, (error) => {
            this.infoMessage = `Onboarding: ${this.formatError(error)}`;
            this.errorHandler.handleError(error);
        });
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

            return res.length > 0 ? res : '' + error;
        }
        return error;
    }
}
