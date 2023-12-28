import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPersonnelComponent } from './roles-personnel.component';

describe('RolesPersonnelComponent', () => {
  let component: RolesPersonnelComponent;
  let fixture: ComponentFixture<RolesPersonnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolesPersonnelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesPersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
