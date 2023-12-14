import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChoixSousDocumentComponent } from './modal-choix-sous-document.component';

describe('ModalChoixSousDocumentComponent', () => {
  let component: ModalChoixSousDocumentComponent;
  let fixture: ComponentFixture<ModalChoixSousDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalChoixSousDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalChoixSousDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
