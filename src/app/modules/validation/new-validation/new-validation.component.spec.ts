import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewValidationComponent } from './new-validation.component';

describe('NewValidationComponent', () => {
  let component: NewValidationComponent;
  let fixture: ComponentFixture<NewValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewValidationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
