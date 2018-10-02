import { OnboardingConfiguration, OnboardingItem, OnboardingItemContainer } from '../models';
import { EventEmitter } from '@angular/core';

/**
 * Mock implementation for OnboardingService
 * For unit testing only!
 */

export class OnboardingServiceMock {

    public readonly visibleItems = new OnboardingItemContainer();
    public visibleItemsChanged = new EventEmitter();
    public readonly instanceId: string;

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
