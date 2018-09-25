import {Pipe, PipeTransform} from '@angular/core';
import {PrimitiveTranslateService} from './primitive-translate.service';

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
