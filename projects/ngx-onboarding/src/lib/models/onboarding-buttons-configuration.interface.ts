import {OnboardingButtonsPosition} from './onboarding-buttons-position.enum';

export interface OnboardingButtonsConfiguration {
    position?: OnboardingButtonsPosition;
    verticalDistanceToBorderInPx?: number;
    horizontalDistanceToBorderInPx?: number;
}
