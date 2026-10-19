import { TestBed } from '@angular/core/testing';
import { LocalStorageEnabledStatusService } from './local-storage-enabled-status.service';
import { ErrorHandler } from '@angular/core';

describe('LocalStorageEnabledStatusService', () => {
    let errorHandler: ErrorHandler;
    let service: LocalStorageEnabledStatusService;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                LocalStorageEnabledStatusService,
            ],
        });
        errorHandler = TestBed.inject(ErrorHandler);
        service = TestBed.inject(LocalStorageEnabledStatusService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('load with true expect enabled to be true', async () => {
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('true');
        service.load().subscribe((enabled: boolean) => {
            expect(enabled).toEqual(true);
            ;
        });
    });

    it('load with getItem throws an error expect enabled to be true', async () => {

        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('getItem failed');
        });
        const errorSpy = vi.spyOn(errorHandler, 'handleError').mockImplementation(() => {
        });
        service.load().subscribe((enabled: boolean) => {
            expect(enabled).toBe(true);
            expect(errorSpy).toHaveBeenCalled();
            ;
        });
    });

    it('save expect setItem to have been called with true', () => {
        const errorSpy = vi.spyOn(errorHandler, 'handleError').mockImplementation(() => {
        });
        const storageSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        });
        service.save(true);
        expect(storageSpy).toHaveBeenCalledWith('42cfe10a-c2d3-42ba-9c55-6198545a0c49', 'true');
        expect(errorSpy).not.toHaveBeenCalled();
    });

    it('save expect setItem to have been called with false', () => {
        const errorSpy = vi.spyOn(errorHandler, 'handleError').mockImplementation(() => {
        });
        const storageSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        });
        service.save(false);
        expect(storageSpy).toHaveBeenCalledWith('42cfe10a-c2d3-42ba-9c55-6198545a0c49', 'false');
        expect(errorSpy).not.toHaveBeenCalled();
    });

    it('save expect setItem to call errorhandler if exception occurs', () => {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('setItem failed');
        });
        const errorSpy = vi.spyOn(errorHandler, 'handleError').mockImplementation(() => {
        });
        service.save(false);
        expect(errorSpy).toHaveBeenCalled();
    });

});
