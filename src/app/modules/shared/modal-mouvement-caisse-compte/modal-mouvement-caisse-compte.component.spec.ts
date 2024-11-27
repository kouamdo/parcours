import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMouvementCaisseCompteComponent } from './modal-mouvement-caisse-compte.component';

describe('ModalMouvementCaisseCompteComponent', () => {
  let component: ModalMouvementCaisseCompteComponent;
  let fixture: ComponentFixture<ModalMouvementCaisseCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMouvementCaisseCompteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMouvementCaisseCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
