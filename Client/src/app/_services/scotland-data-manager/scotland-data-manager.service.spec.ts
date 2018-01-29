import { TestBed, inject } from '@angular/core/testing';

import { ScotlandDataManagerService } from './scotland-data-manager.service';

describe('ScotlandDataManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScotlandDataManagerService]
    });
  });

  it('should be created', inject([ScotlandDataManagerService], (service: ScotlandDataManagerService) => {
    expect(service).toBeTruthy();
  }));
});
