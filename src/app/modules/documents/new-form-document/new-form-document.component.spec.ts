import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFormDocumentComponent } from './new-form-document.component';

describe('NewFormDocumentComponent', () => {
  let component: NewFormDocumentComponent;
  let fixture: ComponentFixture<NewFormDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewFormDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewFormDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
