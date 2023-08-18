import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPrecomvtComponent } from './view-precomvt.component';

describe('ViewPrecomvtComponent', () => {
  let component: ViewPrecomvtComponent;
  let fixture: ComponentFixture<ViewPrecomvtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPrecomvtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPrecomvtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
