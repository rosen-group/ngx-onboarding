import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * wrapper for native implentations of querySelector from window.document
 */
@Injectable()
export class BrowserDOMSelectorService {

    constructor(@Inject(DOCUMENT) private doc: any) {
    }

    /** see https://developer.mozilla.org/de/docs/Web/API/Document/querySelectorAll */
    public querySelectorAll(cssQuery: string): any[] {
        return this.doc.querySelectorAll(cssQuery);
    }

    /** see https://developer.mozilla.org/de/docs/Web/API/Document/querySelector */
    public querySelector(cssQuery: string): any {
        return this.doc.querySelector(cssQuery);
    }


}
