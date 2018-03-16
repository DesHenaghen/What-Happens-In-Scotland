import { TestBed, inject } from '@angular/core/testing';

import { DataManagerService } from './data-manager.service';
import {EdinburghDataManagerService, GlasgowDataManagerService, ScotlandDataManagerService} from '../';

describe('DataManagerService', () => {
  const glasgowSpy = jasmine.createSpyObj('GlasgowDataManagerService', ['listenOnSockets']);
  const edinburghSpy = jasmine.createSpyObj('EdinburghDataManagerService', ['listenOnSockets']);
  const scotlandSpy = jasmine.createSpyObj('ScotlandDataManagerService', ['listenOnSockets']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataManagerService,
        {provide: GlasgowDataManagerService, useValue: glasgowSpy},
        {provide: EdinburghDataManagerService, useValue: edinburghSpy},
        {provide: ScotlandDataManagerService, useValue: scotlandSpy}
      ]
    });
  });

  it('should be created', inject([DataManagerService], (service: DataManagerService) => {
    expect(service).toBeTruthy();
  }));
});
