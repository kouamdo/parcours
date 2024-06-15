import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPersonnelsComponent } from './detail-personnels.component';

describe('DetailPersonnelsComponent', () => {
  let component: DetailPersonnelsComponent;
  let fixture: ComponentFixture<DetailPersonnelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPersonnelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPersonnelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
