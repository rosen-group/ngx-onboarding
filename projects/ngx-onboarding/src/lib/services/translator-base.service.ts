import {EventEmitter} from '@angular/core';

/**
 * Base interface for translatorservice (used for core ngx-onboarding labels)
 */
export abstract class TranslatorBaseService {

    /**
     * implement an EventEmitter with the language key as one its arguments
     * the argument has the minimium properties lang: string (where lang is the new language code)
     */
    abstract onLangChange: EventEmitter<{ lang: string }>;

    /**
     * The language (code) currently used
     */
    abstract get currentLang(): string;

    /**
     * Returns a translation instantly from the internal state of loaded translation.
     * the keys (with translation examples in english) are
     'ONBOARDING': 'Onboarding',
     'ONBOARDING_FAILED_TO_LOAD_USER_SETTINGS': 'Failed to load onboarding settings.',
     'ONBOARDING_FAILED_TO_SAVE_USER_SETTINGS': 'Failed to save onboarding settings.',
     'ONBOARDING_GOT_IT_MSG': 'Got it',
     'ONBOARDING_DO_NOT_SHOW_AGAIN_MSG': 'Turn off',
     'ONBOARDING_NEXT_MSG': 'Next',
     'ONBOARDING_ENABLE': 'Turn on',
     'ONBOARDING_DISABLE': 'Turn off',
     'ONBOARDING_CLEAR': 'Reset'
     */
    abstract instant(key: string): string;

}
