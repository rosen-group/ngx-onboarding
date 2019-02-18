import { Component, ViewEncapsulation } from '@angular/core';
import {OnboardingIconConfiguration} from './models/onboarding-icon-configuration.interface';
import {OnboardingService} from './services/onboarding.service';


/**
 * onboarding button including context menu (see header.component in rolib/navigation)
 */
@Component({
    selector: 'rosen-onboarding-button',
    templateUrl: './onboarding-button.component.html',
    styleUrls: ['./onboarding-button.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class OnboardingButtonComponent {

    /** used by template to apply the customizations on icons */
    public iconConfig: OnboardingIconConfiguration;

    constructor(private onboardingService: OnboardingService) {
        const config = onboardingService.getConfiguration();
        if (config) {
            this.iconConfig = config.iconConfiguration;
        }
    }

    /**
     * if true, the count is visible
     * is true, if the onboarding service is disabled and at least one onboarding item is visible
     */
    public get showOnboardingItemCount(): boolean {
        return !this.onboardingService.isEnabled() &&
            this.onboardingService.visibleItems &&
            this.onboardingService.visibleItems.totalLength > 0;
    }

    /**
     * gets the visible item count
     */
    public get onboardingItemCount(): number {
        return this.onboardingService.visibleItems.totalLength;
    }

    /**
     * used by template
     * enables the onboarding service
     */
    public enableOnboarding(): void {
        this.onboardingService.enable();
    }

    /**
     * disables the onboarding service
     */
    public disableOnboarding(): void {
        this.onboardingService.disable();
    }

    /**
     * resets the onboarding service
     * removes all selectors from seen selectors
     */
    public clearOnboarding(): void {
        this.onboardingService.clearSeenSelectors();
    }

    /**
     * is true, if the onboarding service is enabled
     */
    public isOnboardingEnabled(): boolean {
        return this.onboardingService.isEnabled();
    }
}
