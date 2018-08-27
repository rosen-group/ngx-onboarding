import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { OnboardingModule, OnboardingService } from '../../projects/ngx-onboarding/src';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatIconRegistry } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

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
    providers: [MatIconRegistry, OnboardingService],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, onboardingService: OnboardingService) {
        iconRegistry.addSvgIcon('onboarding_white',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/onboarding_white.svg'));
        iconRegistry.addSvgIcon('onboarding_black',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/onboarding_black.svg'));
        iconRegistry.addSvgIcon('onboarding_blue',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/onboarding_blue.svg'));
        iconRegistry.addSvgIcon('onboarding_combined',
            sanitizer.bypassSecurityTrustResourceUrl('./assets/icons/onboarding_combined_icon.svg'));
        onboardingService.configure({
            iconConfiguration: {
                svgIcon: 'onboarding_combined'
            },
            textConfiguration: {
                regularFontFamily: '"Segoe UI", "SegoeUI-Regular","Tahoma", Helvetica, Arial, sans-serif;',
                scriptFontFamily: '"Segoe Script", "Comic Sans MS", Georgia,  Times New Roman, serif;'
            }
        });

        /**
         * examples for different icon techniques
         * ```typescript
         * onboardingService.configure({
         *   iconConfiguration: {
         *         matIconName: 'help'
         *   }
         * });
         * ```
         *```typescript
         * iconRegistry.registerFontClassAlias('gl', 'glyphicon');
         * onboardingService.configure({
         *   iconConfiguration: {
         *       fontSet: 'gl',
         *       fontIcon: 'glyphicon-plus'
         *   }
         *});
         * ```
         */

    }
}
