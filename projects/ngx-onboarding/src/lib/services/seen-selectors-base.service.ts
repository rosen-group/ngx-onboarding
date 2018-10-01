import {Observable} from 'rxjs';

/**
 * Base class for storing the onboarding item seen status. Can be overridden with own implementations
 * if you don't want to store the settings in the local storage
 */
export abstract class SeenSelectorsBaseService {

    abstract load(): Observable<Array<string>>;

    abstract save(seenSelectors: Array<string>): Observable<boolean>;

}
