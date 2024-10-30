import { TestBed } from '@angular/core/testing';

import { CodeBarreContinuService } from './code-barre-continu.service';

describe('CodeBarreContinuService', () => {
  let service: CodeBarreContinuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeBarreContinuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
