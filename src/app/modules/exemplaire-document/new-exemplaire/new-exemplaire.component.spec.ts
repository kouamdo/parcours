import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExemplaireComponent } from './new-exemplaire.component';

describe('NewExemplaireComponent', () => {
  let component: NewExemplaireComponent;
  let fixture: ComponentFixture<NewExemplaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewExemplaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewExemplaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
