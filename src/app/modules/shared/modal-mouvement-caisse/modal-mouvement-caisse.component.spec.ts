import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMouvementCaisseComponent } from './modal-mouvement-caisse.component';

describe('ModalMouvementCaisseComponent', () => {
  let component: ModalMouvementCaisseComponent;
  let fixture: ComponentFixture<ModalMouvementCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalMouvementCaisseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMouvementCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
