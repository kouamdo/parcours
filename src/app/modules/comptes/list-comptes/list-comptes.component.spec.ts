import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComptesComponent } from './list-comptes.component';

describe('ListComptesComponent', () => {
  let component: ListComptesComponent;
  let fixture: ComponentFixture<ListComptesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListComptesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListComptesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
