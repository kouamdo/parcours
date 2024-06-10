import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResetPwdComponent } from './modal-reset-pwd.component';

describe('ModalResetPwdComponent', () => {
  let component: ModalResetPwdComponent;
  let fixture: ComponentFixture<ModalResetPwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalResetPwdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalResetPwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
