import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {MatIconModule, MatIconRegistry} from '@angular/material/icon';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {OnboardingComponent} from "../../projects/ngx-onboarding/src/lib/onboarding.component";
import {OnboardingService} from "../../projects/ngx-onboarding/src/lib/services/onboarding.service";
import { OnboardingButtonsPosition } from "projects/ngx-onboarding/src/lib/models/onboarding-buttons-position.enum";
import {OnboardingButtonComponent} from "../../projects/ngx-onboarding/src/lib/onboarding-button.component";
import {CommonModule} from "@angular/common";
import {OnboardingItemComponent} from "../../projects/ngx-onboarding/src/lib/onboarding-item.component";
import {SeenSelectorsBaseService} from "../../projects/ngx-onboarding/src/lib/services/seen-selectors-base.service";
import {
    LocalStorageSeenSelectorsService
} from "../../projects/ngx-onboarding/src/lib/services/local-storage-seen-selectors.service";
import {EnabledStatusBaseService} from "../../projects/ngx-onboarding/src/lib/services/enabled-status-base.service";
import {
    LocalStorageEnabledStatusService
} from "../../projects/ngx-onboarding/src/lib/services/local-storage-enabled-status.service";
import {BuildInTranslatorService} from "../../projects/ngx-onboarding/src/lib/services/build-in-translator.service";
import {TranslatorBaseService} from "../../projects/ngx-onboarding/src/lib/services/translator-base.service";

/**
 * Example module to test the onboarding component
 */
@NgModule({
    declarations: [
        AppComponent
    ],
    bootstrap: [
        AppComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        OnboardingComponent,
        OnboardingButtonComponent,
        OnboardingItemComponent,
        MatIconModule,
        MatButtonModule,
        MatButton
    ],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        {
            provide: SeenSelectorsBaseService, useClass: LocalStorageSeenSelectorsService
        },
        {
            provide: EnabledStatusBaseService, useClass: LocalStorageEnabledStatusService
        },
        {
            provide: TranslatorBaseService, useClass: BuildInTranslatorService
        },
    ]
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
