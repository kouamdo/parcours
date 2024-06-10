import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChoixMissionsComponent } from './modal-choix-missions.component';

describe('ModalChoixMissionsComponent', () => {
  let component: ModalChoixMissionsComponent;
  let fixture: ComponentFixture<ModalChoixMissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalChoixMissionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalChoixMissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
