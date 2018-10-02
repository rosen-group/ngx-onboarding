import { async, inject, TestBed } from '@angular/core/testing';
import { LocalStorageEnabledStatusService } from './local-storage-enabled-status.service';
import { ErrorHandler } from '@angular/core';

describe('LocalStorageEnabledStatusService', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                LocalStorageEnabledStatusService,
            ],
        });
    }));

    it('should be created', inject([LocalStorageEnabledStatusService], (service: LocalStorageEnabledStatusService) => {
        expect(service).toBeTruthy();
    }));

    it('load with true expect enabled to be true',
        inject([LocalStorageEnabledStatusService], (service: LocalStorageEnabledStatusService) => {
            spyOn(localStorage, 'getItem').and.returnValue('true');

            service.load().subscribe(enabled => {
                expect(enabled).toBe(true);
            });
        })
    );

    it('load with getItem throws an error expect enabled to be true',
        inject([LocalStorageEnabledStatusService, ErrorHandler],
            (service: LocalStorageEnabledStatusService, errorHandler: ErrorHandler) => {

                spyOn(localStorage, 'getItem').and.throwError('getItem failed');
                const errorSpy = spyOn(errorHandler, 'handleError').and.stub();
                service.load().subscribe(enabled => {
                    expect(enabled).toBe(true);
                    expect(errorSpy).toHaveBeenCalled();
                });
            })
    );

    it('save expect setItem to have been called with true',
        inject([LocalStorageEnabledStatusService], (service: LocalStorageEnabledStatusService) => {
            const spy = spyOn(localStorage, 'setItem').and.stub();

            service.save(true);

            expect(spy).toHaveBeenCalledWith('42cfe10a-c2d3-42ba-9c55-6198545a0c49', 'true');
        })
    );

    it('save expect setItem to have been called with false',
        inject([LocalStorageEnabledStatusService], (service: LocalStorageEnabledStatusService) => {
            const spy = spyOn(localStorage, 'setItem').and.stub();

            service.save(false);

            expect(spy).toHaveBeenCalledWith('42cfe10a-c2d3-42ba-9c55-6198545a0c49', 'false');
        })
    );

    it('save expect setItem to have been called with false',
        inject([LocalStorageEnabledStatusService, ErrorHandler],
            (service: LocalStorageEnabledStatusService, errorHandler: ErrorHandler) => {

                spyOn(localStorage, 'setItem').and.throwError('setItem failed');
                const errorSpy = spyOn(errorHandler, 'handleError').and.stub();

                service.save(false);

                expect(errorSpy).toHaveBeenCalled();
            })
    );

});
