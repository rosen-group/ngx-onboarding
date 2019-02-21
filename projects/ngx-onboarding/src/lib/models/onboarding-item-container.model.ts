import { VisibleOnboardingItem } from './visible-onboarding-item.model';

/**
 * Container to pass visible onboarding elements from onboarding service
 * to onboarding component (which can be grouped by their "group" field).
 *
 * Current group of elements can be accessed via currentItems(). Next group can be accessed via nextItems().
 *
 * Container does not have immediate access to grouping keys since elements are stored in jagged array.
 */
export class OnboardingItemContainer {

    private items: Array<VisibleOnboardingItem> = [];
    private totalCount = 0;
    private currentGroupIndex = 0;

    public get isEmpty(): boolean {
        return !this.items || this.totalCount === 0;
    }

    /**
     * Check if there is another group of visible onboarding items
     */
    public get hasNext(): boolean {
        return this.items && this.currentGroupIndex < (this.items.length - 1);
    }

    /**
     * Return current group of visible onboarding items
     */
    public get currentItem(): VisibleOnboardingItem {
        if (this.items && this.currentGroupIndex < this.items.length) {
            return this.items[this.currentGroupIndex];
        }
        return null;
    }

    /**
     * Return list of All visible onboarding items (regardless of grouping)
     */
    public get allItems(): Array<VisibleOnboardingItem> {
        return this.items.slice();
    }

    /**
     * Return count of all items (regardless of grouping)
     */
    public get totalLength() {
        return this.totalCount;
    }

    /**
     * Return next group of visible onboarding items
     */
    public nextItem(): VisibleOnboardingItem {
        if (this.hasNext) {
            this.currentGroupIndex++;
            return this.currentItem;
        }
        return null;
    }

    /**
     * Add new group of items
     */
    public add(items: Array<VisibleOnboardingItem>) {
        if (items) {
            this.items.push(...items);
            this.totalCount += items.length;
        }
    }

    /**
     * Clear items from container
     */
    public clear(): void {
        this.items = [];
        this.totalCount = 0;
        this.currentGroupIndex = 0;
    }
}
