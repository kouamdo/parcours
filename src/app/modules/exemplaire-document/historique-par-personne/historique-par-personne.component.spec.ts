import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueParPersonneComponent } from './historique-par-personne.component';

describe('HistoriqueParPersonneComponent', () => {
  let component: HistoriqueParPersonneComponent;
  let fixture: ComponentFixture<HistoriqueParPersonneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoriqueParPersonneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueParPersonneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
