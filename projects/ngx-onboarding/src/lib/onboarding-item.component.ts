import {VisibleOnboardingItem} from './models/visible-onboarding-item.model';
import {TranslatorBaseService} from './services/translator-base.service';
import {WindowRef} from './services/window-ref.service';
import {OnboardingHtmlElementHelper} from './models/onboarding-html-element-helper';
import {Component, ElementRef, Input, ViewChild, ViewEncapsulation} from '@angular/core';

const topPadding = 25;
const rightPadding = 25;
const leftPadding = 25;

/**
 * used by onboarding component
 * shows the headline and detail text of the OnboardingItem
 * calculates the positions of the item
 */
@Component({
    selector: 'rosen-onboarding-item',
    templateUrl: './onboarding-item.component.html',
    styleUrls: ['./onboarding-item.component.less'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class OnboardingItemComponent {

    /**
     * the onboarding item with headline and text and the target html element
     */
    @Input()
    public item: VisibleOnboardingItem;

    /**
     * the onboarding item container
     * used to calculate the position
     */
    @ViewChild('container', { static: true })
    private container: ElementRef;

    constructor(private translatorService: TranslatorBaseService, private windowRef: WindowRef) {
    }

    /**
     * calculates the position of the OnboardingItemComponent
     */
    public getStyle() {
        const pos = OnboardingHtmlElementHelper.getPosition(this.item.element);
        let transform = 'none';

        switch (this.item.item.position) {
            case 'top':
                pos.x += this.item.element.offsetWidth / 2;
                if (pos.x < this.getContainerWidth() / 2) {
                    pos.x = this.getContainerWidth() / 2;
                } else if (pos.x > this.getWindowScreenWidth() - this.getContainerWidth()) {
                    pos.x = this.getWindowScreenWidth() - this.getContainerWidth();
                }
                pos.y -= topPadding;
                transform = 'translate(-50%,-100%)';
                break;
            case 'right':
                pos.x += Math.min(this.item.element.offsetWidth + rightPadding, this.getWindowScreenWidth() - this.getContainerWidth() / 2);
                pos.y += this.item.element.offsetHeight / 2;
                if (pos.y < 0) {
                    pos.y = 0;
                } else if (pos.y > this.getWindowScreenHeight() - this.getContainerHeight() / 2) {
                    pos.y = this.getWindowScreenHeight() - this.getContainerHeight() / 2;
                }
                transform = 'translateY(-50%)';
                break;
            case 'left':
                pos.x -= leftPadding;
                pos.y += this.item.element.offsetHeight / 2;
                if (pos.y < 0) {
                    pos.y = 0;
                } else if (pos.y > this.getWindowScreenHeight() - this.getContainerHeight() / 2) {
                    pos.y = this.getWindowScreenHeight() - this.getContainerHeight() / 2;
                }
                transform = 'translate(-100%,-50%)';
                break;
            case 'topleft':
                pos.x -= leftPadding;
                pos.y -= topPadding;
                if (pos.y < 0) {
                    pos.y = 0;
                } else if (pos.y > this.getWindowScreenHeight() - this.getContainerHeight() / 2) {
                    pos.y = this.getWindowScreenHeight() - this.getContainerHeight() / 2;
                }
                transform = 'translate(-100%,-100%)';
                break;

            case 'bottom':
            default:
                pos.x += this.item.element.offsetWidth / 2;
                if (pos.x < this.getContainerWidth() / 2) {
                    pos.x = this.getContainerWidth() / 2;
                } else if (pos.x > this.getWindowScreenWidth() - this.getContainerWidth()) {
                    pos.x = this.getWindowScreenWidth() - this.getContainerWidth();
                }
                pos.y += this.item.element.offsetHeight;
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
        const description = this.item.item.descriptions?.find( d => d.language === this.translatorService.currentLang);
        return description ? description.headline : this.item.item.headline;
    }

    public getDetails(): string {
        const description = this.item.item.descriptions?.find( d => d.language === this.translatorService.currentLang);
        return description ? description.details : this.item.item.details;
    }

    public getTextAlignClass(): string {
        if ((this.item.item.textAlign == null) || this.item.item.textAlign === 'center') {
            return ''; // ==> center
        }
        return `align-${this.item.item.textAlign}`;
    }

    private getContainerWidth(): number {
        return this.container.nativeElement.offsetWidth;
    }

    private getContainerHeight(): number {
        return this.container.nativeElement.offsetHeight;
    }

    private getWindowScreenWidth(): number {
        return this.windowRef.nativeWindow ? this.windowRef.nativeWindow.screen.width : 1024;
    }

    private getWindowScreenHeight(): number {
        return this.windowRef.nativeWindow ? this.windowRef.nativeWindow.screen.height : 768;
    }
}
