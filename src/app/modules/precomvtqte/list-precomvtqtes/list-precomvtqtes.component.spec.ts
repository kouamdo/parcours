import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPrecomvtqtesComponent } from './list-precomvtqtes.component';

describe('ListPrecomvtqtesComponent', () => {
  let component: ListPrecomvtqtesComponent;
  let fixture: ComponentFixture<ListPrecomvtqtesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPrecomvtqtesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPrecomvtqtesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
