import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDistributeursComponent } from './list-distributeurs.component';

describe('ListDistributeursComponent', () => {
  let component: ListDistributeursComponent;
  let fixture: ComponentFixture<ListDistributeursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDistributeursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDistributeursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
