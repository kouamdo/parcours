import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAffecterComptePersonnelComponent } from './modal-affecter-compte-personnel.component';

describe('ModalAffecterComptePersonnelComponent', () => {
  let component: ModalAffecterComptePersonnelComponent;
  let fixture: ComponentFixture<ModalAffecterComptePersonnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAffecterComptePersonnelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAffecterComptePersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
