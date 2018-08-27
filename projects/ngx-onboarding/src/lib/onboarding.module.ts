import { NgModule } from '@angular/core';
import { OnboardingComponent } from './onboarding.component';
import { OnboardingItemComponent } from './onboarding-item.component';
import { OnboardingButtonComponent } from './onboarding-button.component';
import { CommonModule } from '@angular/common';
import { MatBadgeModule, MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { BrowserDOMSelectorService, PrimitiveTranslatePipe, PrimitiveTranslateService } from './services';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatBadgeModule,
        MatIconModule,
        MatMenuModule,
        HttpClientModule
    ],
    declarations: [OnboardingComponent,
        OnboardingItemComponent,
        OnboardingButtonComponent, PrimitiveTranslatePipe],
    exports: [OnboardingComponent,
        OnboardingButtonComponent],
    providers: [BrowserDOMSelectorService, PrimitiveTranslateService]
})
export class OnboardingModule {
}
