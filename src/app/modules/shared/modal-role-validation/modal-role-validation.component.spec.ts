import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRoleValidationComponent } from './modal-role-validation.component';

describe('ModalRoleValidationComponent', () => {
  let component: ModalRoleValidationComponent;
  let fixture: ComponentFixture<ModalRoleValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRoleValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRoleValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
