import { TestBed, inject } from '@angular/core/testing';

import { GlasgowDataManagerService } from './glasgow-data-manager.service';

describe('GlasgowDataManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlasgowDataManagerService]
    });
  });

  it('should be created', inject([GlasgowDataManagerService], (service: GlasgowDataManagerService) => {
    expect(service).toBeTruthy();
  }));
});
