import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExemplaireComponent } from './list-exemplaire.component';

describe('ListExemplaireComponent', () => {
  let component: ListExemplaireComponent;
  let fixture: ComponentFixture<ListExemplaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListExemplaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListExemplaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
