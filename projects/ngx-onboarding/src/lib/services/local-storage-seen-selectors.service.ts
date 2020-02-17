import { SeenSelectorsBaseService } from './seen-selectors-base.service';
import {ErrorHandler, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import * as _ from 'lodash';

/**
 * Unique key to identify the seen onboarding items in the local storage
 */
const seenSelectorsLocalStorageKey = '894ae732-b4bd-45c9-b543-6f9c5c5a86b6';

/**
 * Stores the seen onboarding items to the local storage
 *
 * If you want to implement an own service to store the data e.g. in a database you can extend
 * your own service from theSeenSelectorsBaseService and use the provide feature in your app.module with
 * {provide: SeenSelectorsBaseService, useClass: YourOwnSeenSelectorsService}
 */
@Injectable()
export class LocalStorageSeenSelectorsService extends SeenSelectorsBaseService {

    constructor(private errorHandler: ErrorHandler) {
        super();
    }

    /**
     * loads seen items from localStorage
     * @returns string array of all seen selectors
     */
    public load(): Observable<Array<string>> {
        const seenSelectorsString = localStorage.getItem(seenSelectorsLocalStorageKey);
        if (!_.isEmpty(seenSelectorsString)) {
            try {
                return of(JSON.parse(seenSelectorsString));
            } catch (error) {
                this.errorHandler.handleError(error);
            }
        }
        return of([]);
    }

    /**
     * save items to localStorage
     * @returns success of the operation (true = good, false = failed)
     */
    public save(seenSelectors: Array<string>): void {
        try {
            localStorage.setItem(seenSelectorsLocalStorageKey, JSON.stringify(seenSelectors));
        } catch (error) {
            this.errorHandler.handleError(error);
        }
    }
}
