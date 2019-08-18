import { TestBed } from '@angular/core/testing';

import { FriendsFinderService } from './friends-finder.service';

describe('FriendsFinderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FriendsFinderService = TestBed.get(FriendsFinderService);
    expect(service).toBeTruthy();
  });
});
