import { TestBed } from '@angular/core/testing';

import { PrecoMvtsService } from './precomvts.service';

describe('PrecomvtsService', () => {
  let service: PrecoMvtsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrecoMvtsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
