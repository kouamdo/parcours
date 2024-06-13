import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDocEtatsComponent } from './modal-document-doc-etats.component';

describe('ModalDocEtatsComponent', () => {
  let component: ModalDocEtatsComponent;
  let fixture: ComponentFixture<ModalDocEtatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDocEtatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDocEtatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
