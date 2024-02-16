import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCodebarreComponent } from './modal-codebarre.component';

describe('ModalCodebarreComponent', () => {
  let component: ModalCodebarreComponent;
  let fixture: ComponentFixture<ModalCodebarreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCodebarreComponent ]
    });

    fixture = TestBed.createComponent(ModalCodebarreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
