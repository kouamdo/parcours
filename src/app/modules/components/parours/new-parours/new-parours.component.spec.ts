import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewParoursComponent } from './new-parours.component';

describe('NewParoursComponent', () => {
  let component: NewParoursComponent;
  let fixture: ComponentFixture<NewParoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewParoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewParoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
