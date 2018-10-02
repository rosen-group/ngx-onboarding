import { SeenSelectorsBaseService } from './seen-selectors-base.service';
import { Observable, of } from 'rxjs';

/**
 * Mock of the SeenSelectorsBaseService for unit testing
 */
export class MockLocalStorageSeenSelectorsService extends SeenSelectorsBaseService {
    public load(): Observable<Array<string>> {
        return of([]);
    }

    public save(seenSelectors: Array<string>): Observable<boolean> {
        return of(false);
    }
}
