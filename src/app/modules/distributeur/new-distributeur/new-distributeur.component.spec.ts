import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDistributeurComponent } from './new-distributeur.component';

describe('NewDistributeurComponent', () => {
  let component: NewDistributeurComponent;
  let fixture: ComponentFixture<NewDistributeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewDistributeurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDistributeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
