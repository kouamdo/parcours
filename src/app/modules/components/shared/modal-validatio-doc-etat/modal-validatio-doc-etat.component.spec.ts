import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalValidatioDocEtatComponent } from './modal-validatio-doc-etat.component';

describe('ModalValidatioDocEtatComponent', () => {
  let component: ModalValidatioDocEtatComponent;
  let fixture: ComponentFixture<ModalValidatioDocEtatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalValidatioDocEtatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalValidatioDocEtatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
