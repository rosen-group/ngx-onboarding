import {Observable} from 'rxjs';

/**
 * Base class for storing the onboarding item enabled status. Can be overridden with own implementations
 * if you don't want to store the settings in the local storage
 */
export abstract class EnabledStatusBaseService {
    abstract save(enabled: boolean): Observable<never>;

    abstract load(): Observable<boolean>;
}
