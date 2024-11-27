import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCaissesComponent } from './list-caisses.component';

describe('ListCaissesComponent', () => {
  let component: ListCaissesComponent;
  let fixture: ComponentFixture<ListCaissesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCaissesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCaissesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
