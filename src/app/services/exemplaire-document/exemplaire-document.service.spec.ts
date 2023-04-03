import { TestBed } from '@angular/core/testing';

import { ExemplaireDocumentService } from './exemplaire-document.service';

describe('ExemplaireDocumentService', () => {
  let service: ExemplaireDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExemplaireDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
