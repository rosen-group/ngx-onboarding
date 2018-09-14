import { OnboardingConfiguration, OnboardingItem } from '../models';

/**
 * Mock implementation for OnboardingService
 * For unit testing only!
 */

export class OnboardingServiceMock {

    public get registeredItemsCount(): number {
        return 1;
    }

    public configure(configuration: OnboardingConfiguration) {
    }

    public getConfiguration() {
        return {};
    }

    public register(items: Array<OnboardingItem>): Function {
        return () => {
        };
    }

    public check(filterGroupBy: string = null) {
    }

    public hide() {
    }

    public disable() {
    }

    public enable() {
    }

    public isEnabled(): boolean {
        return true;
    }

    public clearSeenSelectors(): void {
    }

}
