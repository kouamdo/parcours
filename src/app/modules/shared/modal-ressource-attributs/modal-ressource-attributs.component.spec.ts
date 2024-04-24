import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRessourceAttributsComponent } from './modal-ressource-attributs.component';

describe('ModalRessourceAttributsComponent', () => {
  let component: ModalRessourceAttributsComponent;
  let fixture: ComponentFixture<ModalRessourceAttributsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRessourceAttributsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRessourceAttributsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
