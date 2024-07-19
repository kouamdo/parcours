import { TestBed } from '@angular/core/testing';

import { PassActionService } from './pass-action.service';

describe('PassActionService', () => {
  let service: PassActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
