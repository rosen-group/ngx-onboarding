import { NgModule } from '@angular/core';
import { OnboardingComponent } from './onboarding.component';
import {OnboardingItemComponent} from './onboarding-item.component';
import {OnboardingButtonComponent} from './onboarding-button.component';
import {CommonModule} from '@angular/common';
import {MatMenuModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule
  ],
  declarations: [OnboardingComponent,
    OnboardingItemComponent,
    OnboardingButtonComponent],
  exports: [OnboardingComponent,
    OnboardingItemComponent,
    OnboardingButtonComponent]
})
export class OnboardingModule { }
