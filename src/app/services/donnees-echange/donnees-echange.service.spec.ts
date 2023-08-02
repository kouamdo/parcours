import { TestBed } from '@angular/core/testing';

import { DonneesEchangeService } from './donnees-echange.service';

describe('DonneesEchangeService', () => {
  let service: DonneesEchangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonneesEchangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
