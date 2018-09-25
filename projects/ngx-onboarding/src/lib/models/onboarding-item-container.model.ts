import {VisibleOnboardingItem} from './visible-onboarding-item.model';

/**
 * Container to pass visible onboarding elements from onboarding service
 * to onboarding component (which can be grouped by their "group" field).
 *
 * Current group of elements can be accessed via currentItems(). Next group can be accessed via nextItems().
 *
 * Container does not have immediate access to grouping keys since elements are stored in jagged array.
 */
export class OnboardingItemContainer {

    private groupedItems: Array<Array<VisibleOnboardingItem>> = [];
    private totalCount = 0;
    private currentGroupIndex = 0;

    public get isEmpty(): boolean {
        return !this.groupedItems || this.totalCount === 0;
    }

    /**
     * Check if there is another group of visible onboarding items
     */
    public get hasNext(): boolean {
        return this.groupedItems && this.currentGroupIndex < (this.groupedItems.length - 1);
    }

    /**
     * Return current group of visible onboarding items
     */
    public get currentItems(): Array<VisibleOnboardingItem> {
        if (this.groupedItems && this.currentGroupIndex < this.groupedItems.length) {
            return this.groupedItems[this.currentGroupIndex];
        }
        return [];
    }

    /**
     * Return list of All visible onboarding items (regardless of grouping)
     */
    public get allItems(): Array<VisibleOnboardingItem> {
        return [].concat.apply([], this.groupedItems);
    }

    /**
     * Return length of current group of items
     */
    public get currentLength(): number {
        return this.currentItems.length;
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
    public nextItems(): Array<VisibleOnboardingItem> {
        if (this.hasNext) {
            this.currentGroupIndex++;
            return this.currentItems;
        }

        return [];
    }

    /**
     * Add new group of items
     */
    public add(arr: Array<VisibleOnboardingItem>) {
        if (arr && arr.length > 0) {
            this.groupedItems.push(arr);
            this.totalCount += arr.length;
        }
    }

    /**
     * Clear items from container
     */
    public clear(): void {
        this.groupedItems = [];
        this.totalCount = 0;
        this.currentGroupIndex = 0;
    }
}
