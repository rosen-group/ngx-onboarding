import {SeenSelectorsBaseService} from './seen-selectors-base-service.model';
import * as _ from 'lodash';
import {ErrorHandler, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

const seenSelectorsLocalStorageKey = '894ae732-b4bd-45c9-b543-6f9c5c5a86b6';

@Injectable()
export class LocalStorageSeenSelectorsService extends SeenSelectorsBaseService {

    constructor(private errorHandler: ErrorHandler) {
        super();
    }

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

    public save(seenSelectors: Array<string>): Observable<boolean> {
        try {
            localStorage.setItem(seenSelectorsLocalStorageKey, JSON.stringify(seenSelectors));
            return of(true);
        } catch (error) {
            this.errorHandler.handleError(error);
        }
        return of(false);
    }
}
