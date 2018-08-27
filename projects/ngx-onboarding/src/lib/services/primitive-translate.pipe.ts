import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { PrimitiveTranslateService } from './primitive-translate.service';


@Injectable()
@Pipe({
    name: 'translate',
    pure: true
})
export class PrimitiveTranslatePipe implements PipeTransform {
    constructor(private translateService: PrimitiveTranslateService) {

    }
    transform(query: string, ...args: any[]): any {
        return this.translateService.translate(query);
        //return 'TRANSlation';
    }
}
