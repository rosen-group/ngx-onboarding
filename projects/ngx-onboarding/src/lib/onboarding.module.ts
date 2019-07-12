import { NgModule } from '@angular/core';
import { OnboardingComponent } from './onboarding.component';
import { OnboardingItemComponent } from './onboarding-item.component';
import { OnboardingButtonComponent } from './onboarding-button.component';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientModule } from '@angular/common/http';
import {PrimitiveTranslatePipe} from './pipes/primitive-translate.pipe';
import {BrowserDOMSelectorService} from './services/browser-dom-selector.service';
import {WindowRef} from './services/window-ref.service';
import {SeenSelectorsBaseService} from './services/seen-selectors-base.service';
import {EnabledStatusBaseService} from './services/enabled-status-base.service';
import {TranslatorBaseService} from './services/translator-base.service';
import {LocalStorageSeenSelectorsService} from './services/local-storage-seen-selectors.service';
import {LocalStorageEnabledStatusService} from './services/local-storage-enabled-status.service';
import {BuildInTranslatorService} from './services/build-in-translator.service';

/**
 * Module for ngx-onboarding.
 * Import this into your "main" module e.g. AppModule
 */
@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatBadgeModule,
        MatIconModule,
        MatMenuModule,
        HttpClientModule
    ],
    declarations: [
        OnboardingComponent,
        OnboardingItemComponent,
        OnboardingButtonComponent,
        PrimitiveTranslatePipe
    ],
    exports: [
        OnboardingComponent,
        OnboardingButtonComponent
    ],
    providers: [
        BrowserDOMSelectorService,
        WindowRef,
        {
            provide: SeenSelectorsBaseService, useClass: LocalStorageSeenSelectorsService
        },
        {
            provide: EnabledStatusBaseService, useClass: LocalStorageEnabledStatusService
        },
        {
            provide: TranslatorBaseService, useClass: BuildInTranslatorService
        }

    ]
})
export class OnboardingModule {
}
