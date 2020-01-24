import { TestBed } from '@angular/core/testing';

import { CrxMessageServiceBackground } from './crx-msg-background.service';

describe('CrxMessageServiceBackground', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrxMessageServiceBackground = TestBed.get(CrxMessageServiceBackground);
    expect(service).toBeTruthy();
  });
});
