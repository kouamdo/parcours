import { TestBed } from '@angular/core/testing';

import { PrecoMvtQtesService } from './preco-mvt-qtes.service';

describe('PrecoMvtQtesService', () => {
  let service: PrecoMvtQtesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrecoMvtQtesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
