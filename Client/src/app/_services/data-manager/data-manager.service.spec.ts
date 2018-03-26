import { TestBed } from '@angular/core/testing';

import { DataManagerService } from './data-manager.service';
import {EdinburghDataManagerService, GlasgowDataManagerService, ScotlandDataManagerService} from '../';
import {MapModes} from '../../_models/MapModes';
import {DataManagerInterface} from '../../_interfaces/data-manager.interface';

describe('DataManagerService', () => {
  const glasgowSpy = jasmine.createSpyObj('GlasgowDataManagerService',
    ['getMapBoundaryId', 'refreshAllDistrictsData', 'listenOnSockets']);
  const edinburghSpy = jasmine.createSpyObj('EdinburghDataManagerService',
    ['refreshAllDistrictsData', 'listenOnSockets']);
  const scotlandSpy = jasmine.createSpyObj('ScotlandDataManagerService',
    ['getMapBoundaryId', 'refreshAllDistrictsData', 'listenOnSockets']);
  let service: DataManagerService;

  beforeEach(() => {
    glasgowSpy.getMapBoundaryId.and.returnValue('Glasgow');
    scotlandSpy.getMapBoundaryId.and.returnValue('Scotland');

    TestBed.configureTestingModule({
      providers: [
        DataManagerService,
        {provide: GlasgowDataManagerService, useValue: glasgowSpy},
        {provide: EdinburghDataManagerService, useValue: edinburghSpy},
        {provide: ScotlandDataManagerService, useValue: scotlandSpy}
      ]
    });

    service = TestBed.get(DataManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the default DataManager to Scotland', () => {
    service.getDataManager().subscribe((dm: DataManagerInterface) => {
      expect(dm.getMapBoundaryId()).toBe('Scotland');
    });
  });

  it('should swap the active DataManager', () => {
    service.selectDataManager(MapModes.Glasgow);
    service.getDataManager().subscribe((dm: DataManagerInterface) => {
      expect(dm.getMapBoundaryId()).toBe('Glasgow');
    });
  });

  it('should update data in every DataManager', () => {
    service.refreshAllDistrictsData(new Date(), 3);
    expect(scotlandSpy.refreshAllDistrictsData).toHaveBeenCalledTimes(1);
    expect(glasgowSpy.refreshAllDistrictsData).toHaveBeenCalledTimes(1);
    expect(edinburghSpy.refreshAllDistrictsData).toHaveBeenCalledTimes(1);
  });
});
