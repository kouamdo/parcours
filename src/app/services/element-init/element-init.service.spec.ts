import { TestBed } from '@angular/core/testing';

import { ElementInitService } from './element-init.service';

describe('ElementInitService', () => {
  let service: ElementInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElementInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
