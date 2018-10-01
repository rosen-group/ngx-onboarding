import {Injectable} from '@angular/core';

/**
 * return the global native browser window object
 */
function _window(): any {
    return window;
}

/**
 * Abstraction of the window reference
 */
@Injectable()
export class WindowRef {

    public get nativeWindow(): any {
        return _window();
    }
}
