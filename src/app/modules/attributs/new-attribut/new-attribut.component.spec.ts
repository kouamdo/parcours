import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAttributComponent } from './new-attribut.component';

describe('NewAttributComponent', () => {
  let component: NewAttributComponent;
  let fixture: ComponentFixture<NewAttributComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewAttributComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAttributComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
