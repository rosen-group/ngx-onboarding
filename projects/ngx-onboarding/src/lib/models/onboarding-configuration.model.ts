import { OnboardingIconConfiguration } from './onboarding-icon-configuration.interface';
import { OnboardingTextConfiguration } from './onboarding-text-configuration.interface';
import {OnboardingButtonsConfiguration} from './onboarding-buttons-configuration.interface';

/**
 * global configuration parameters for onboarding
 * for icon configuration see: https://material.angular.io/components/icon/overview
 * because the properties below a derived from that behave exactly the same
 */
export interface OnboardingConfiguration {
    iconConfiguration?: OnboardingIconConfiguration;
    textConfiguration?: OnboardingTextConfiguration;
    buttonsConfiguration?: OnboardingButtonsConfiguration;
}



