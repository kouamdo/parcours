import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalChoixGroupsComponent } from './modal-choix-groups.component';

describe('ModalChoixGroupsComponent', () => {
  let component: ModalChoixGroupsComponent;
  let fixture: ComponentFixture<ModalChoixGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalChoixGroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalChoixGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
