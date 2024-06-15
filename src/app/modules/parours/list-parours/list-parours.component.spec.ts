import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListParoursComponent } from './list-parours.component';

describe('ListParoursComponent', () => {
  let component: ListParoursComponent;
  let fixture: ComponentFixture<ListParoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListParoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListParoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
