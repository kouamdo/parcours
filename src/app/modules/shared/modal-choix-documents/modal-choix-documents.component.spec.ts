import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChoixDocumentsComponent } from './modal-choix-documents.component';

describe('ModalChoixDocumentsComponent', () => {
  let component: ModalChoixDocumentsComponent;
  let fixture: ComponentFixture<ModalChoixDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalChoixDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalChoixDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
