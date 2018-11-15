import { OnboardingIconConfiguration } from './onboarding-icon-configuration.interface';
import { OnboardingTextConfiguration } from './onboarding-text-configuration.interface';
import {OnboardingButtonsConfiguration} from './onboarding-buttons-configuration.interface';

/**
 * global configuration parameters for onboarding
 * for icon configuration see: https://material.angular.io/components/icon/overview
 * because the properties below a derived from that behave exactly the same
 */
export interface OnboardingConfiguration {

    /**
     * configuration for the onboarding button icon and the icon in the upper left corner
     */
    iconConfiguration?: OnboardingIconConfiguration;

    /**
     * configuration for the font settings
     */
    textConfiguration?: OnboardingTextConfiguration;

    /**
     * configuration for the position of the 'turn off' and 'next' buttons
     */
    buttonsConfiguration?: OnboardingButtonsConfiguration;
}



