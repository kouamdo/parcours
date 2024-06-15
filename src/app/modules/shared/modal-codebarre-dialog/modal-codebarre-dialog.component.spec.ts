import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCodebarreDialogComponent } from './modal-codebarre-dialog.component';

describe('ModalCodebarreDialogComponent', () => {
  let component: ModalCodebarreDialogComponent;
  let fixture: ComponentFixture<ModalCodebarreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCodebarreDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCodebarreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
