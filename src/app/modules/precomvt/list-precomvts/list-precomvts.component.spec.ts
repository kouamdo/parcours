import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPrecomvtsComponent } from './list-precomvts.component';

describe('ListPrecomvtsComponent', () => {
  let component: ListPrecomvtsComponent;
  let fixture: ComponentFixture<ListPrecomvtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPrecomvtsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPrecomvtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
