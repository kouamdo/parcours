import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChoixPreconisationsComponent } from './modal-choix-preconisations.component';

describe('ModalChoixPreconisationsComponent', () => {
  let component: ModalChoixPreconisationsComponent;
  let fixture: ComponentFixture<ModalChoixPreconisationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalChoixPreconisationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalChoixPreconisationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
