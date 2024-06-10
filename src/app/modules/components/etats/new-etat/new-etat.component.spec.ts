import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEtatComponent } from './new-etat.component';

describe('NewEtatComponent', () => {
  let component: NewEtatComponent;
  let fixture: ComponentFixture<NewEtatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEtatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEtatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
