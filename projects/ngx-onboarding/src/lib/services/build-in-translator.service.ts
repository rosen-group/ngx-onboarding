import { EventEmitter, Injectable } from '@angular/core';
import { TranslatorBaseService } from './translator-base.service';


/**
 * Service for the translations of internal text
 */
@Injectable(
    {providedIn: 'root' /* makes sure that service stays a single instance among seperate modules */}
)
export class BuildInTranslatorService extends TranslatorBaseService {

    /**
     *  An EventEmitter to listen to lang change events.
     *  A LangChangeEvent is an object with the minimium properties lang: string (where lang is the new language code)
     */
    public onLangChange: EventEmitter<{ lang: string }> = new EventEmitter<{ lang: string }>();
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

    /**
     * The language (code) currently used
     */
    public get currentLang(): string {
        return 'en';
    }

    /**
     * Returns a translation instantly from the internal state of loaded translation.
     */
    public instant(key: string): string {
        const text = this.translations[key];
        if (typeof text === 'string') {
            return text;
        }
        return key;
    }


}
