import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanneauTicketComponent } from './panneau-ticket.component';

describe('PanneauTicketComponent', () => {
  let component: PanneauTicketComponent;
  let fixture: ComponentFixture<PanneauTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanneauTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanneauTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
