import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBilleterieComponent } from './modal-billeterie.component';

describe('ModalBilleterieComponent', () => {
  let component: ModalBilleterieComponent;
  let fixture: ComponentFixture<ModalBilleterieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalBilleterieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBilleterieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
