import {NgModule} from '@angular/core';
import {OnboardingComponent} from './onboarding.component';
import {OnboardingItemComponent} from './onboarding-item.component';
import {OnboardingButtonComponent} from './onboarding-button.component';
import {CommonModule} from '@angular/common';
import {MatBadgeModule, MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {
    BrowserDOMSelectorService,
    BuildInTranslatorService,
    EnabledStatusBaseService,
    LocalStorageEnabledStatusService,
    LocalStorageSeenSelectorsService,
    SeenSelectorsBaseService,
    TranslatorBaseService,
    WindowRef
} from './services';
import {NgxUidModule} from 'ngx-uid';
import {PrimitiveTranslatePipe} from './pipes';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatBadgeModule,
        MatIconModule,
        MatMenuModule,
        HttpClientModule,
        NgxUidModule.forRoot()
    ],
    declarations: [
        OnboardingComponent,
        OnboardingItemComponent,
        OnboardingButtonComponent, PrimitiveTranslatePipe
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
