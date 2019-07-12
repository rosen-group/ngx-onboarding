import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {OnboardingButtonsPosition, OnboardingModule, OnboardingService} from '../../projects/ngx-onboarding/src';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
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
    constructor(onboardingService: OnboardingService, sanitizer: DomSanitizer, iconRegistry: MatIconRegistry) {
        iconRegistry.addSvgIcon('onboarding_icon',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/onboarding_icon.svg'));
        onboardingService.configure({
            buttonsConfiguration: {
                position: OnboardingButtonsPosition.BottomRight,
                verticalDistanceToBorderInPx: 10,
                horizontalDistanceToBorderInPx: 10
            },
            textConfiguration: {
                regularFontFamily: 'Helvetica, Arial, sans-serif;',
                scriptFontFamily: '"Comic Sans MS", Georgia,  Times New Roman, serif;'
            },
            iconConfiguration: {
                svgIcon: 'onboarding_icon'
            }
        });
    }

}
