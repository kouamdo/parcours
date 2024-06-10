import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrevisualisationExemplaireComponent } from './previsualisation-exemplaire.component';

describe('PrevisualisationExemplaireComponent', () => {
  let component: PrevisualisationExemplaireComponent;
  let fixture: ComponentFixture<PrevisualisationExemplaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrevisualisationExemplaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrevisualisationExemplaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
