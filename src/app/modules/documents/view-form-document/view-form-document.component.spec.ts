import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFormDocumentComponent } from './view-form-document.component';

describe('ViewFormDocumentComponent', () => {
  let component: ViewFormDocumentComponent;
  let fixture: ComponentFixture<ViewFormDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFormDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFormDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
