
import {EMPTY, Observable, of} from 'rxjs';
import {EnabledStatusBaseService} from './enabled-status-base.service';

/**
 * Mock of the EnabledStatusBaseService for unit testing
 */
export class MockLocalStorageEnabledStatusService extends EnabledStatusBaseService {

    public load(): Observable<boolean> {
        return of(true);
    }

    public save(enabled: boolean): Observable<never> {
        return EMPTY;
    }
}
