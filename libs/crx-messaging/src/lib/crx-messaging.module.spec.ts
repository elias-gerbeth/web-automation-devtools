import { async, TestBed } from '@angular/core/testing';
import { CrxMessagingModule } from './crx-messaging.module';

describe('CrxMessagingModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CrxMessagingModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CrxMessagingModule).toBeDefined();
  });
});
