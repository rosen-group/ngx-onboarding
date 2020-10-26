import { inject, TestBed, waitForAsync} from '@angular/core/testing';
import { BuildInTranslatorService } from './build-in-translator.service';


describe('BuildInTranslatorService', () => {
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                BuildInTranslatorService
            ],
        });
    }));

    it('should be created', inject([BuildInTranslatorService], (service: BuildInTranslatorService) => {
        expect(service).toBeTruthy();
    }));

    it('should return text for valid key', inject([BuildInTranslatorService], (service: BuildInTranslatorService) => {
        (service as any).translations = {
            'TEST': 'This is a unit test'
        };
        expect(service.instant('TEST')).toBe('This is a unit test');
    }));

    it('should return key for invalid string key', inject([BuildInTranslatorService], (service: BuildInTranslatorService) => {
        (service as any).translations = {
            'TEST': 'This is a unit test'
        };
        expect(service.instant('INVALID')).toBe('INVALID');
    }));

    it('should return key for invalid number key', inject([BuildInTranslatorService], (service: BuildInTranslatorService) => {
        (service as any).translations = {
            'TEST': 'This is a unit test'
        };
        expect(service.instant('42')).toBe('42');
    }));
});
