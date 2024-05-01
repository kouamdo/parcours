import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChoixPersonneComponent } from './modal-choix-personne.component';

describe('ModalChoixPersonneComponent', () => {
  let component: ModalChoixPersonneComponent;
  let fixture: ComponentFixture<ModalChoixPersonneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalChoixPersonneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalChoixPersonneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
