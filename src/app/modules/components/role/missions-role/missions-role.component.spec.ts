import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsRoleComponent } from './missions-role.component';

describe('MissionsRoleComponent', () => {
  let component: MissionsRoleComponent;
  let fixture: ComponentFixture<MissionsRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissionsRoleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionsRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
