import { TestBed } from '@angular/core/testing';

import { EtapesService } from './etapes.service';

describe('EtapesService', () => {
  let service: EtapesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtapesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
