import { async, TestBed } from '@angular/core/testing';
import { BackendWalmartModule } from './backend-walmart.module';

describe('BackendWalmartModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BackendWalmartModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(BackendWalmartModule).toBeDefined();
  });
});
