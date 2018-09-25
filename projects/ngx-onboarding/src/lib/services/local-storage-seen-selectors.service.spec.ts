import {async, inject, TestBed} from '@angular/core/testing';
import {LocalStorageSeenSelectorsService} from './local-storage-seen-selectors.service';
import {ErrorHandler} from '@angular/core';

describe('LocalStorageSeenSelectorsService', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                LocalStorageSeenSelectorsService,
            ],
        });
    }));

    it('should be created',
        inject([LocalStorageSeenSelectorsService], (service: LocalStorageSeenSelectorsService) => {
            expect(service).toBeTruthy();
        })
    );

    it('load expect seenSelectors.length to be 3',
        inject([LocalStorageSeenSelectorsService], (service: LocalStorageSeenSelectorsService) => {
            spyOn(localStorage, 'getItem').and.returnValue('["a","b","c"]');

            service.load().subscribe(seenSelectors => {
                expect(seenSelectors.length).toBe(3);
                expect(seenSelectors[1]).toBe('b');
            });
        })
    );

    it('load with localStorage.getItem returns invalid json string expect seenSelectors.length to be 0 ',
        inject([LocalStorageSeenSelectorsService, ErrorHandler],
            (service: LocalStorageSeenSelectorsService, errorHandler: ErrorHandler) => {

                spyOn(localStorage, 'getItem').and.returnValue('invalid json string');
                const spy = spyOn(errorHandler, 'handleError').and.stub();

                service.load().subscribe(seenSelectors => {
                    expect(seenSelectors.length).toBe(0);
                    expect(spy).toHaveBeenCalled();
                });
            })
    );

    it('save expect localStorage.setItem to have been called',
        inject([LocalStorageSeenSelectorsService], (service: LocalStorageSeenSelectorsService) => {
            const spy = spyOn(localStorage, 'setItem').and.stub();

            service.save(['A', 'B', 'C']).subscribe(result => {
                expect(result).toBe(true);
                expect(spy).toHaveBeenCalledWith('894ae732-b4bd-45c9-b543-6f9c5c5a86b6', '["A","B","C"]');
            });
        })
    );

    it('save with localStorage.getItem throws error expect errorHandler to have been called',
        inject([LocalStorageSeenSelectorsService, ErrorHandler],
            (service: LocalStorageSeenSelectorsService, errorHandler: ErrorHandler) => {

                spyOn(localStorage, 'setItem').and.throwError('setItem failed');
                const spy = spyOn(errorHandler, 'handleError').and.stub();

                service.save(['A', 'B', 'C']).subscribe(result => {
                    expect(result).toBe(false);
                    expect(spy).toHaveBeenCalled();
                });
            })
    );

});
