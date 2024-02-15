import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListValidationsComponent } from './list-validations.component';

describe('ListValidationsComponent', () => {
  let component: ListValidationsComponent;
  let fixture: ComponentFixture<ListValidationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListValidationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListValidationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
