import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCodebarreScanContinueComponent } from './modal-codebarre-scan-continue.component';

describe('ModalCodebarreScanContinueComponent', () => {
  let component: ModalCodebarreScanContinueComponent;
  let fixture: ComponentFixture<ModalCodebarreScanContinueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCodebarreScanContinueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCodebarreScanContinueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
