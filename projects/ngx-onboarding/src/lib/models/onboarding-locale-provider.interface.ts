import {Observable} from 'rxjs';

export interface OnboardingLocaleProvider {

    getCurrentLanguageId(): Observable<string>;

    getCurrentTranslations(): Observable<{ [key: string]: string }>;

}


