import { TestBed, inject } from '@angular/core/testing';

import { DataManagerService } from './data-manager.service';

describe('DataManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataManagerService]
    });
  });

  it('should be created', inject([DataManagerService], (service: DataManagerService) => {
    expect(service).toBeTruthy();
  }));
});
