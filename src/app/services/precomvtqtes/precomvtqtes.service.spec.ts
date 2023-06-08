import { TestBed } from '@angular/core/testing';

import { PrecomvtqtesService } from './precomvtqtes.service';

describe('PrecomvtqtesService', () => {
  let service: PrecomvtqtesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrecomvtqtesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
