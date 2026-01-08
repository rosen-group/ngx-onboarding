import {BrowserDOMSelectorService} from './services/browser-dom-selector.service';
import {WindowRef} from './services/window-ref.service';
import {SeenSelectorsBaseService} from './services/seen-selectors-base.service';
import {EnabledStatusBaseService} from './services/enabled-status-base.service';
import {TranslatorBaseService} from './services/translator-base.service';
import {LocalStorageSeenSelectorsService} from './services/local-storage-seen-selectors.service';
import {LocalStorageEnabledStatusService} from './services/local-storage-enabled-status.service';
import {BuildInTranslatorService} from './services/build-in-translator.service';
import {NgModule} from '@angular/core';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

/**
 * Module for ngx-onboarding.
 * Import this into your "main" module e.g. AppModule
 */
@NgModule({
    providers: [
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class OnboardingModule {
}
