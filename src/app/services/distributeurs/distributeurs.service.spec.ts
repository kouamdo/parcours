import { TestBed } from '@angular/core/testing';

import { DistributeursService } from './distributeurs.service';

describe('DistributeursService', () => {
  let service: DistributeursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistributeursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
