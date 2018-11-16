import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {OnboardingButtonsPosition, OnboardingModule, OnboardingService} from '../../projects/ngx-onboarding/src';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';


/**
 * Example module to test the onboarding component
 */
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        OnboardingModule,
        MatIconModule,
        MatButtonModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(onboardingService: OnboardingService) {
        onboardingService.configure({
            buttonsConfiguration: {
                position: OnboardingButtonsPosition.BottomRight,
                verticalDistanceToBorderInPx: 10,
                horizontalDistanceToBorderInPx: 10
            }
        });
    }

}
