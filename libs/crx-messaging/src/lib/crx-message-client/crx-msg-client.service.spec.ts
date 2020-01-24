import { TestBed } from '@angular/core/testing';

import { CrxMsgClientService } from './crx-msg-client.service';

describe('CrxMsgClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrxMsgClientService = TestBed.get(CrxMsgClientService);
    expect(service).toBeTruthy();
  });
});
