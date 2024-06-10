import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRessourceComponent } from './new-ressource.component';

describe('NewRessourceComponent', () => {
  let component: NewRessourceComponent;
  let fixture: ComponentFixture<NewRessourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRessourceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRessourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
