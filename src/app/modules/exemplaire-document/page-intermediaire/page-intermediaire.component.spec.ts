import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageIntermediaireComponent } from './page-intermediaire.component';

describe('PageIntermediaireComponent', () => {
  let component: PageIntermediaireComponent;
  let fixture: ComponentFixture<PageIntermediaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PageIntermediaireComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageIntermediaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
