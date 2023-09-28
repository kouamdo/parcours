import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChoixAttributsComponent } from './modal-choix-attributs.component';

describe('ModalChoixAttributsComponent', () => {
  let component: ModalChoixAttributsComponent;
  let fixture: ComponentFixture<ModalChoixAttributsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalChoixAttributsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalChoixAttributsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
