import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPrecomvtqteComponent } from './new-precomvtqte.component';

describe('NewPrecomvtqteComponent', () => {
  let component: NewPrecomvtqteComponent;
  let fixture: ComponentFixture<NewPrecomvtqteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPrecomvtqteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPrecomvtqteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
