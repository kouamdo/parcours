import { TestBed } from '@angular/core/testing';

import { ModalCodebarreService } from './modal-codebarre.service';

describe('ModalCodebarreService', () => {
  let service: ModalCodebarreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalCodebarreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
