import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExemplaireComponent } from './view-exemplaire.component';

describe('ViewExemplaireComponent', () => {
  let component: ViewExemplaireComponent;
  let fixture: ComponentFixture<ViewExemplaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewExemplaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewExemplaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
