import { TestBed } from '@angular/core/testing';
import { LocalStorageSeenSelectorsService } from './local-storage-seen-selectors.service';
import { ErrorHandler } from '@angular/core';

describe('LocalStorageSeenSelectorsService', () => {
    let errorHandler: ErrorHandler;
    let service: LocalStorageSeenSelectorsService;
    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [
                LocalStorageSeenSelectorsService,
            ],
        });
        errorHandler = TestBed.inject(ErrorHandler);
        service = TestBed.inject(LocalStorageSeenSelectorsService);
    });

    it('should be created', () => {
        expect(service).toBeDefined();
    });

    it('load expect seenSelectors.length to be 3', async () => {
        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('["a","b","c"]');

        service.load().subscribe((seenSelectors: Array<string>) => {
            expect(seenSelectors.length).toEqual(3);
            expect(seenSelectors[1]).toEqual('b');
            ;
        });
    });

    it('load with localStorage.getItem returns invalid json string expect seenSelectors.length to be 0 ', async () => {

        vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid json string');
        const spy = vi.spyOn(errorHandler, 'handleError').mockImplementation(() => {
        });

        service.load().subscribe(seenSelectors => {
            expect(seenSelectors.length).toBe(0);
            expect(spy).toHaveBeenCalled();
            ;
        });
    });

    it('save expect localStorage.setItem to have been called', () => {
        const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        });
        service.save(['A', 'B', 'C']);
        expect(spy).toHaveBeenCalledWith('894ae732-b4bd-45c9-b543-6f9c5c5a86b6', '["A","B","C"]');
    });

    it('save with localStorage.getItem throws error expect errorHandler to have been called', () => {
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('setItem failed');
        });
        const spy = vi.spyOn(errorHandler, 'handleError').mockImplementation(() => {
        });
        service.save(['A', 'B', 'C']);
        expect(spy).toHaveBeenCalled();
    });
});

