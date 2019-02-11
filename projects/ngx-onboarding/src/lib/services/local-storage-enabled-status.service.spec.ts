import { async, TestBed } from '@angular/core/testing';
import { LocalStorageEnabledStatusService } from './local-storage-enabled-status.service';
import { ErrorHandler } from '@angular/core';

describe('LocalStorageEnabledStatusService', () => {
    let errorHandler: ErrorHandler;
    let service: LocalStorageEnabledStatusService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                LocalStorageEnabledStatusService,
            ],
        });
        errorHandler = TestBed.get(ErrorHandler);
        service = TestBed.get(LocalStorageEnabledStatusService);
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('load with true expect enabled to be true', done => {
            spyOn(localStorage, 'getItem').and.returnValue('true');
            service.load().subscribe((enabled: boolean) => {
                expect(enabled).toEqual(true);
                done();
            });
        }
    );

    it('load with getItem throws an error expect enabled to be true', done => {

            spyOn(localStorage, 'getItem').and.throwError('getItem failed');
            const errorSpy = spyOn(errorHandler, 'handleError').and.stub();
            service.load().subscribe((enabled: boolean) => {
                expect(enabled).toBe(true);
                expect(errorSpy).toHaveBeenCalled();
                done();
            });
        }
    );

    it('save expect setItem to have been called with true', () => {
            const errorSpy = spyOn(errorHandler, 'handleError').and.stub();
            const storageSpy = spyOn(localStorage, 'setItem').and.stub();
            service.save(true);
            expect(storageSpy).toHaveBeenCalledWith('42cfe10a-c2d3-42ba-9c55-6198545a0c49', 'true');
            expect(errorSpy).not.toHaveBeenCalled();
        }
    );

    it('save expect setItem to have been called with false', () => {
            const errorSpy = spyOn(errorHandler, 'handleError').and.stub();
            const storageSpy = spyOn(localStorage, 'setItem').and.stub();
            service.save(false);
            expect(storageSpy).toHaveBeenCalledWith('42cfe10a-c2d3-42ba-9c55-6198545a0c49', 'false');
            expect(errorSpy).not.toHaveBeenCalled();
        }
    );

    it('save expect setItem to call errorhandler if exception occurs', () => {
            spyOn(localStorage, 'setItem').and.throwError('setItem failed');
            const errorSpy = spyOn(errorHandler, 'handleError').and.stub();
            service.save(false);
            expect(errorSpy).toHaveBeenCalled();
        }
    );

});
