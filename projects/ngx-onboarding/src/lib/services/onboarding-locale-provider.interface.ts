/**
 * @author RKlein@rosen-group.com
 */
import { Observable } from 'rxjs';
import { TranslationsDictionary } from '../models';

export interface OnboardingLocaleProvider {
    getCurrentLanguageId(): Observable<string>;

    getCurrentranslations(): Observable<TranslationsDictionary>;
}


