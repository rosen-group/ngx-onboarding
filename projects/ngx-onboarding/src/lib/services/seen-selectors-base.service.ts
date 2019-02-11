import {Observable} from 'rxjs';

/**
 * Base class for storing the onboarding item seen status. Can be overridden with own implementations
 * if you don't want to store the settings in the local storage
 */
export abstract class SeenSelectorsBaseService {

    /**
     * loads seen items from a persistent storage
     * @returns string array of all seen selectors
     */
    abstract load(): Observable<Array<string>>;

    /**
     * save items to a persistent storage
     */
    abstract save(seenSelectors: Array<string>): void;

}
