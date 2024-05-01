import { TestBed } from '@angular/core/testing';

import { ParoursService } from './parours.service';

describe('ParoursService', () => {
  let service: ParoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
