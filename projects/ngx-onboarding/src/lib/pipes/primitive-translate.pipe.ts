import {Pipe, PipeTransform} from '@angular/core';
import {PrimitiveTranslateService} from '../services/primitive-translate.service';

/**
 * Pipe for internal usage to translate the text on the onboarding component like disable, enable
 */
@Pipe({
    name: 'translate',
    pure: true
})
export class PrimitiveTranslatePipe implements PipeTransform {

    constructor(private translateService: PrimitiveTranslateService) {
    }

    public transform(query: string, ...args: any[]): any {
        return this.translateService.translate(query);
    }
}
