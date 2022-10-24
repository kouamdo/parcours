import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementInitComponent } from './element-init.component';

describe('ElementInitComponent', () => {
  let component: ElementInitComponent;
  let fixture: ComponentFixture<ElementInitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementInitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElementInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
