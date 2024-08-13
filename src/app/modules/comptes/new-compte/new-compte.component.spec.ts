import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCompteComponent } from './new-compte.component';

describe('NewCompteComponent', () => {
  let component: NewCompteComponent;
  let fixture: ComponentFixture<NewCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCompteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
