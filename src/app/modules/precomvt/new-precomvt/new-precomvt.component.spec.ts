import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPrecomvtComponent } from './new-precomvt.component';

describe('NewPrecomvtComponent', () => {
  let component: NewPrecomvtComponent;
  let fixture: ComponentFixture<NewPrecomvtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPrecomvtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPrecomvtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
