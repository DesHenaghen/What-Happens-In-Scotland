import { TestBed, inject } from '@angular/core/testing';

import { EdinburghDataManagerService } from './edinburgh-data-manager.service';

describe('EdinburghDataManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EdinburghDataManagerService]
    });
  });

  it('should be created', inject([EdinburghDataManagerService], (service: EdinburghDataManagerService) => {
    expect(service).toBeTruthy();
  }));
});
