import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFormDocumentComponent } from './list-form-document.component';

describe('ListFormDocumentComponent', () => {
  let component: ListFormDocumentComponent;
  let fixture: ComponentFixture<ListFormDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFormDocumentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFormDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
