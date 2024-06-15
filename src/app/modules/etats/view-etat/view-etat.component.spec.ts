import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEtatComponent } from './view-etat.component';

describe('ViewEtatComponent', () => {
  let component: ViewEtatComponent;
  let fixture: ComponentFixture<ViewEtatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEtatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEtatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
