import { TestBed } from '@angular/core/testing';

import { PdfExemplaireGeneratorService } from './pdf-exemplaire-generator.service';

describe('PdfExemplaireGeneratorService', () => {
  let service: PdfExemplaireGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfExemplaireGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
