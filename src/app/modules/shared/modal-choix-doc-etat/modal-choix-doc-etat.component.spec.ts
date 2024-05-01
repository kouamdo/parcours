import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChoixDocEtatComponent } from './modal-choix-doc-etat.component';

describe('ModalChoixDocEtatComponent', () => {
  let component: ModalChoixDocEtatComponent;
  let fixture: ComponentFixture<ModalChoixDocEtatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalChoixDocEtatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalChoixDocEtatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
