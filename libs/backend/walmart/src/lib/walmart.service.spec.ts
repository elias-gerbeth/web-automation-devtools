import { TestBed } from '@angular/core/testing';

import { WalmartService } from './walmart.service';

describe('WalmartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WalmartService = TestBed.get(WalmartService);
    expect(service).toBeTruthy();
  });
});
