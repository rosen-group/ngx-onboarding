import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { OnboardingItem, OnboardingService } from '../../projects/ngx-onboarding/src';
import { HttpClient } from '@angular/common/http';

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

    constructor(private onboardingService: OnboardingService, private httpClient: HttpClient) {

    }

    ngOnInit() {
        this.loadAndRegisterOnBoardingData();
    }

    private loadAndRegisterOnBoardingData() {
        this.httpClient.get('assets/onboarding/app.json').subscribe((data) => {
            const arr = data as Array<OnboardingItem>;
            this.unregisterOnboarding = this.onboardingService.register(arr);
        }, (error) => {
            this.infoMessage = 'Onboarding: ' + error ? error.toString() : 'Unknown Error';
            console.error(error);
        });
        //
    }

    ngOnDestroy() {
        if (this.unregisterOnboarding) {
            this.unregisterOnboarding();
        }
    }
}
