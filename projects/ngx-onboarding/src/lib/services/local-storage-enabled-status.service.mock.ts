import {EnabledStatusBaseService} from './enabled-status-base-service.model';
import {EMPTY, Observable, of} from 'rxjs';

export class MockLocalStorageEnabledStatusService extends EnabledStatusBaseService {

    public load(): Observable<boolean> {
        return of(true);
    }

    public save(enabled: boolean): Observable<never> {
        return EMPTY;
    }
}
