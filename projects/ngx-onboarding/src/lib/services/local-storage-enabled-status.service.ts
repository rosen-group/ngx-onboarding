import {EnabledStatusBaseService} from './enabled-status-base-service.model';
import {EMPTY, Observable, of} from 'rxjs';
import {ErrorHandler, Injectable} from '@angular/core';

const enabledLocalStorageKey = '42cfe10a-c2d3-42ba-9c55-6198545a0c49';

@Injectable()
export class LocalStorageEnabledStatusService extends EnabledStatusBaseService {

    constructor(private errorHandler: ErrorHandler) {
        super();
    }

    public load(): Observable<boolean> {
        try {
            return of('true' === localStorage.getItem(enabledLocalStorageKey));
        } catch (error) {
            this.errorHandler.handleError(error);
        }
        return of(true);
    }

    public save(enabled: boolean): Observable<never> {
        try {
            localStorage.setItem(enabledLocalStorageKey, enabled ? 'true' : 'false');
        } catch (error) {
            this.errorHandler.handleError(error);
        }
        return EMPTY;
    }
}
