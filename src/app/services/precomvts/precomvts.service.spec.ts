import { TestBed } from '@angular/core/testing';

import { PrecomvtsService } from './precomvts.service';

describe('PrecomvtsService', () => {
  let service: PrecomvtsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrecomvtsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
