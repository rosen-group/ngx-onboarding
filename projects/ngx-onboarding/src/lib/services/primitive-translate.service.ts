import { Injectable } from '@angular/core';


@Injectable()
export class PrimitiveTranslateService {

    private translations = {
        'ONBOARDING': 'Onboarding',
        'ONBOARDING_FAILED_TO_LOAD_USER_SETTINGS': 'Failed to load onboarding settings.',
        'ONBOARDING_FAILED_TO_SAVE_USER_SETTINGS': 'Failed to save onboarding settings.',
        'ONBOARDING_GOT_IT_MSG': 'Got it',
        'ONBOARDING_DO_NOT_SHOW_AGAIN_MSG': 'Turn off',
        'ONBOARDING_NEXT_MSG': 'Next',
        'ONBOARDING_ENABLE': 'Turn on',
        'ONBOARDING_DISABLE': 'Turn off',
        'ONBOARDING_CLEAR': 'Reset'
    };

    translate(key): string {
        const text = this.translations[key];
        if (typeof text === 'string') {
            return text;
        }
        return key;
    }
}
