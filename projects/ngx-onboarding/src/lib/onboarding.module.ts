import {NgModule} from '@angular/core';
import {OnboardingComponent} from './onboarding.component';
import {OnboardingItemComponent} from './onboarding-item.component';
import {OnboardingButtonComponent} from './onboarding-button.component';
import {CommonModule} from '@angular/common';
import {MatBadgeModule, MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {HttpClientModule} from '@angular/common/http';
import {BrowserDOMSelectorService, PrimitiveTranslateService} from './services';
import {WindowRef} from './services/window-ref.service';
import {SeenSelectorsBaseService} from './services/seen-selectors-base.service';
import {LocalStorageSeenSelectorsService} from './services/local-storage-seen-selectors.service';
import {EnabledStatusBaseService} from './services/enabled-status-base-service.model';
import {LocalStorageEnabledStatusService} from './services/local-storage-enabled-status.service';
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
        PrimitiveTranslateService,
        WindowRef,
        {
            provide: SeenSelectorsBaseService, useClass: LocalStorageSeenSelectorsService
        }, {
            provide: EnabledStatusBaseService, useClass: LocalStorageEnabledStatusService
        }

    ]
})
export class OnboardingModule {
}
