import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecuterMissionComponent } from './executer-mission.component';

describe('ExecuterMissionComponent', () => {
  let component: ExecuterMissionComponent;
  let fixture: ComponentFixture<ExecuterMissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExecuterMissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecuterMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
