import {TestBed, async, inject} from '@angular/core/testing';
import {PrimitiveTranslateService} from './primitive-translate.service';

describe('PrimitiveTranslateService', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                PrimitiveTranslateService
            ],
        });
    }));

    it('should be created', inject([PrimitiveTranslateService], (service: PrimitiveTranslateService) => {
        expect(service).toBeTruthy();
    }));

    it('should return text for valid key', inject([PrimitiveTranslateService], (service: PrimitiveTranslateService) => {
        (service as any).translations = {
            'TEST': 'This is a unit test'
        };
        expect(service.translate('TEST')).toBe('This is a unit test');
    }));

    it('should return key for invalid string key', inject([PrimitiveTranslateService], (service: PrimitiveTranslateService) => {
        (service as any).translations = {
            'TEST': 'This is a unit test'
        };
        expect(service.translate('INVALID')).toBe('INVALID');
    }));

    it('should return key for invalid number key', inject([PrimitiveTranslateService], (service: PrimitiveTranslateService) => {
        (service as any).translations = {
            'TEST': 'This is a unit test'
        };
        expect(service.translate(42)).toBe(42 as any);
    }));
});
