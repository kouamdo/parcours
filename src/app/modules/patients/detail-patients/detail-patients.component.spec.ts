import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPatientsComponent } from './detail-patients.component';

describe('DetailPatientsComponent', () => {
  let component: DetailPatientsComponent;
  let fixture: ComponentFixture<DetailPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPatientsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
