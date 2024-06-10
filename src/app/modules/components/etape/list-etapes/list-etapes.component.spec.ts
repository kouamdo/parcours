import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEtapesComponent } from './list-etapes.component';

describe('ListEtapesComponent', () => {
  let component: ListEtapesComponent;
  let fixture: ComponentFixture<ListEtapesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEtapesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEtapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
