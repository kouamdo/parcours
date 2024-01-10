import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChoixSousExemplairesComponent } from './modal-choix-sous-exemplaires.component';

describe('ModalChoixSousExemplairesComponent', () => {
  let component: ModalChoixSousExemplairesComponent;
  let fixture: ComponentFixture<ModalChoixSousExemplairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalChoixSousExemplairesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalChoixSousExemplairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
