import { TestBed } from '@angular/core/testing';

import { EtatsService } from './etats.service';

describe('EtatsService', () => {
  let service: EtatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
