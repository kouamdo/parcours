import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCourantComponent } from './ticket-courant.component';

describe('TicketCourantComponent', () => {
  let component: TicketCourantComponent;
  let fixture: ComponentFixture<TicketCourantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketCourantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketCourantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
