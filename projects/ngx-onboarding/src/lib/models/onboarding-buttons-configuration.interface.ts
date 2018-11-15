import {OnboardingButtonsPosition} from './onboarding-buttons-position.enum';

/**
 * part of the global onboarding configuration
 * change the position of the 'turn off' and 'next' buttons
 */
export interface OnboardingButtonsConfiguration {
    /**
     * position of buttons e.g. top, top-left, left, ...
     */
    position?: OnboardingButtonsPosition;

    /**
     * the distance to the top or bottom border in pixel
     */
    verticalDistanceToBorderInPx?: number;

    /**
     * the distance to the left or right border in pixel
     */
    horizontalDistanceToBorderInPx?: number;
}
