import { async, TestBed } from '@angular/core/testing';
import { SharedStateModule } from './shared-state.module';

describe('SharedStateModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedStateModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(SharedStateModule).toBeDefined();
  });
});
