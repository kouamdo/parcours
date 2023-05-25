import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFamilleComponent } from './new-famille.component';

describe('NewFamilleComponent', () => {
  let component: NewFamilleComponent;
  let fixture: ComponentFixture<NewFamilleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFamilleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewFamilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
