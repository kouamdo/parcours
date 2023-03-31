import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAttributsComponent } from './list-attributs.component';

describe('ListAttributsComponent', () => {
  let component: ListAttributsComponent;
  let fixture: ComponentFixture<ListAttributsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAttributsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAttributsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
