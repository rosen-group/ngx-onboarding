import {Component, ElementRef, Inject, Input, LOCALE_ID, ViewChild, ViewEncapsulation} from '@angular/core';
import { VisibleOnboardingItem } from './models/visible-onboarding-item.model';
import * as _ from 'lodash';
import { HtmlElementHelper } from './models/onboarding-html-helper';

const TopPadding = 25;
const RightPadding = 25;
const LeftPadding = 25;

/**
 * used by onboarding component
 * shows the headline and detail text of the OnboardingItem
 * calculates the positions of the item
 */
@Component({
    selector: 'rosen-onboarding-item',
    templateUrl: './onboarding-item.component.html',
    styleUrls: ['./onboarding-item.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class OnboardingItemComponent {

    /**
     * the onboarding item with headline and text and the target html element
     */
    @Input()
    public item: VisibleOnboardingItem;

    /**
     * the onboarding item container
     * used to calulate the position
     */
    @ViewChild('container')
    private container: ElementRef;

    constructor(@Inject(LOCALE_ID) private locale: string) {
    }

    /**
     * used by template
     * calculates the position of the OnboardingItemComponent
     */
    public getStyle() {
        const pos = HtmlElementHelper.getPosition(this.item.ele);
        let transform = 'none';

        switch (this.item.item.position) {
            case 'top':
                pos.x += this.item.ele.offsetWidth / 2;
                if (pos.x < this.getContainerWidth() / 2) {
                    pos.x = this.getContainerWidth() / 2;
                } else if (pos.x > this.getWindowScreenWidth() - this.getContainerWidth()) {
                    pos.x = this.getWindowScreenWidth() - this.getContainerWidth();
                }
                pos.y -= TopPadding;
                transform = 'translate(-50%,-100%)';
                break;
            case 'right':
                pos.x += Math.min(this.item.ele.offsetWidth + RightPadding, this.getWindowScreenWidth() - this.getContainerWidth() / 2);
                pos.y += this.item.ele.offsetHeight / 2;
                if (pos.y < 0) {
                    pos.y = 0;
                } else if (pos.y > this.getWindowScreenHeight() - this.getContainerHeight() / 2) {
                    pos.y = this.getWindowScreenHeight() - this.getContainerHeight() / 2;
                }
                transform = 'translateY(-50%)';
                break;
            case 'left':
                pos.x -= LeftPadding;
                pos.y += this.item.ele.offsetHeight / 2;
                if (pos.y < 0) {
                    pos.y = 0;
                } else if (pos.y > this.getWindowScreenHeight() - this.getContainerHeight() / 2) {
                    pos.y = this.getWindowScreenHeight() - this.getContainerHeight() / 2;
                }
                transform = 'translate(-100%,-50%)';
                break;
            case 'topleft':
                pos.x -= LeftPadding;
                pos.y -= TopPadding;
                if (pos.y < 0) {
                    pos.y = 0;
                } else if (pos.y > this.getWindowScreenHeight() - this.getContainerHeight() / 2) {
                    pos.y = this.getWindowScreenHeight() - this.getContainerHeight() / 2;
                }
                transform = 'translate(-100%,-100%)';
                break;

            case 'bottom':
            default:
                pos.x += this.item.ele.offsetWidth / 2;
                if (pos.x < this.getContainerWidth() / 2) {
                    pos.x = this.getContainerWidth() / 2;
                } else if (pos.x > this.getWindowScreenWidth() - this.getContainerWidth()) {
                    pos.x = this.getWindowScreenWidth() - this.getContainerWidth();
                }
                pos.y += this.item.ele.offsetHeight;
                transform = 'translate(-50%,25%)';
                break;
        }
        return {
            left: pos.x + 'px',
            transform: transform,
            top: pos.y + 'px'
        };
    }

    public getHeadline(): string {
      const description = _.find(this.item.item.descriptions, d => d.language === this.locale); // TODO en-EN vs en
        return description ? description.headline : this.item.item.headline;
    }

    public getDetails(): string {
        const description = _.find(this.item.item.descriptions, d => d.language === this.locale); // TODO en-EN vs en
        return description ? description.details : this.item.item.details;
    }

    private getContainerWidth(): number {
        return this.container.nativeElement.offsetWidth;
    }

    private getContainerHeight(): number {
        return this.container.nativeElement.offsetHeight;
    }

    private getWindowScreenWidth(): number {
        return window.screen.width;
    }

    private getWindowScreenHeight(): number {
        return window.screen.height;
    }


}
