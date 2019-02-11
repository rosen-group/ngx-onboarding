import { Observable } from 'rxjs';

/**
 * Base class for storing the onboarding item enabled status. Can be overridden with own implementations
 * if you don't want to store the settings in the local storage
 */
export abstract class EnabledStatusBaseService {

    /**
     * saves the status to a persistent storage
     */
    abstract save(enabled: boolean): void;

    /**
     * loads the status from the persistent storage
     * @returns status (true = enabled, false = disabled)
     */
    abstract load(): Observable<boolean>;
}
