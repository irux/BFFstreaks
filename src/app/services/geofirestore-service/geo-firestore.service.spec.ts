import { TestBed } from '@angular/core/testing';

import { GeoFirestoreService } from './geo-firestore.service';

describe('GeoFirestoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeoFirestoreService = TestBed.get(GeoFirestoreService);
    expect(service).toBeTruthy();
  });
});
