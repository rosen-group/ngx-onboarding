import {Observable} from 'rxjs';

export abstract class SeenSelectorsBaseService {

    abstract load(): Observable<Array<string>>;

    abstract save(seenSelectors: Array<string>): Observable<boolean>;

}
