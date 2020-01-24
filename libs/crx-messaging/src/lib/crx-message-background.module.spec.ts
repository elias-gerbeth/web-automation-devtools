import { async, TestBed } from '@angular/core/testing';
import { CrxMessageBackgroundModule } from './crx-message-background.module';

describe('CrxMessageModuleBackground', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CrxMessageBackgroundModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(CrxMessageBackgroundModule).toBeDefined();
  });
});
