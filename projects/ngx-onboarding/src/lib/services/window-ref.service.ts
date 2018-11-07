import { Injectable } from '@angular/core';

/**
 * return the global native browser window object
 */
function _window(): any {
    return window;
}

/**
 * Abstraction of the window reference
 */
@Injectable(
    {providedIn: 'root' /* makes sure that service stays a single instance among seperate modules */}
)
export class WindowRef {

    public get nativeWindow(): any {
        return _window();
    }
}
