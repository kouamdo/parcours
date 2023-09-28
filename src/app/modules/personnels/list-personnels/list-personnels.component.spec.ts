import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPersonnelsComponent } from './list-personnels.component';

describe('ListPersonnelsComponent', () => {
  let component: ListPersonnelsComponent;
  let fixture: ComponentFixture<ListPersonnelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPersonnelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPersonnelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
