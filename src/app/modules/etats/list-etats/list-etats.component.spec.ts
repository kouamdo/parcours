import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEtatsComponent } from './list-etats.component';

describe('ListEtatsComponent', () => {
  let component: ListEtatsComponent;
  let fixture: ComponentFixture<ListEtatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEtatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEtatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
