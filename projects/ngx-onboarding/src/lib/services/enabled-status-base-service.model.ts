import {Observable} from 'rxjs';

export abstract class EnabledStatusBaseService {
    abstract save(enabled: boolean): Observable<never>;

    abstract load(): Observable<boolean>;
}
