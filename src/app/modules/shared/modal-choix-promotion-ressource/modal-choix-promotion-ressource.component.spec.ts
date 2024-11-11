import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChoixPromotionRessourceComponent } from './modal-choix-promotion-ressource.component';

describe('ModalChoixPromotionRessourceComponent', () => {
  let component: ModalChoixPromotionRessourceComponent;
  let fixture: ComponentFixture<ModalChoixPromotionRessourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalChoixPromotionRessourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalChoixPromotionRessourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
