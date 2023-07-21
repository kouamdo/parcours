import { TestBed } from '@angular/core/testing';

import { CategorieAttributService } from './categorie-attribut.service';

describe('CategorieAttributService', () => {
  let service: CategorieAttributService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorieAttributService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
