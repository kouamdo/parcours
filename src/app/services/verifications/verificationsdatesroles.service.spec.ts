import { TestBed } from '@angular/core/testing';
import { VerificationsdatesrolesService } from './verificationsdatesroles.service';

describe('VerificationsdatesrolesService', () => {
  let service: VerificationsdatesrolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerificationsdatesrolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
