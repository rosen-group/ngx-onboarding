import { OnboardingItemDescription } from './onboarding-item-description.model';

export class OnboardingItem {
    public selector: string;
    public headline: string;
    public details: string;
    public textAlign?: 'center' | 'left' | 'right';
    public position: string;
    public descriptions: Array<OnboardingItemDescription>;
    public disableSpotlight = false;
    public disableBackground = false;
    public transparentSpotlight = false;
    public toParent = false;
}
