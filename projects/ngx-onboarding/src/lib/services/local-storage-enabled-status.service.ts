import { EMPTY, Observable, of } from 'rxjs';
import { ErrorHandler, Injectable } from '@angular/core';
import { EnabledStatusBaseService } from './enabled-status-base.service';

/**
 * Unique key to identify the onboarding enabled status in the local storage
 */
const enabledLocalStorageKey = '42cfe10a-c2d3-42ba-9c55-6198545a0c49';

/**
 * Stores the enabled status of the onboarding to the local storage
 *
 * If you want to implement an own service to store the data e.g. in a database you can extend your own service
 * from the EnabledStatusBaseService and use the provide feature in your app.module with
 * {provide: EnabledStatusBaseService, useClass: YourOwnEnabledStatusService}
 */
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
