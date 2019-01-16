import { EventEmitter } from '@angular/core';
import {OnboardingItemContainer} from '../models/onboarding-item-container.model';
import {OnboardingConfiguration} from '../models/onboarding-configuration.model';
import {OnboardingItem} from '../..';

/**
 * Mock implementation for OnboardingService
 * For unit testing only!
 */

export class OnboardingServiceMock {

    public readonly visibleItems = new OnboardingItemContainer();
    public visibleItemsChanged = new EventEmitter();

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
