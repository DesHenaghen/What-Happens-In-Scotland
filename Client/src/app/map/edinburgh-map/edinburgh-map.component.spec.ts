import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdinburghMapComponent } from './edinburgh-map.component';
import {EdinburghDataManagerService} from '../../_services';
import {of} from 'rxjs/observable/of';
import {District} from '../../_models/District';

describe('EdinburghMapComponent', () => {
  let component: EdinburghMapComponent;
  let fixture: ComponentFixture<EdinburghMapComponent>;

  beforeEach(async(() => {
    const edinburghSpy = jasmine.createSpyObj('EdinburghDataManagerService',
      [
        'getDistricts',
        'getLoadedData',
        'getDistrict',
        'getLatestTweet',
        'getMapTopology'
      ]);
    edinburghSpy.getDistricts.and.returnValue(of(undefined));
    edinburghSpy.getLoadedData.and.returnValue(of(true));
    edinburghSpy.getDistrict.and.returnValue(of(new District()));
    edinburghSpy.getLatestTweet.and.returnValue(of(undefined));
    edinburghSpy.getMapTopology.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      declarations: [ EdinburghMapComponent ],
      providers: [
        {provide: EdinburghDataManagerService, useValue: edinburghSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EdinburghMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
