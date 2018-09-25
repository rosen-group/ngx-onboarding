import {SeenSelectorsBaseService} from './seen-selectors-base-service.model';
import {Observable, of} from 'rxjs';

export class MockLocalStorageSeenSelectorsService extends SeenSelectorsBaseService {
    public load(): Observable<Array<string>> {
        return of([]);
    }

    public save(seenSelectors: Array<string>): Observable<boolean> {
        return of(false);
    }
}
