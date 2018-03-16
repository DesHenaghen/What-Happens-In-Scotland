import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlasgowMapComponent } from './glasgow-map.component';
import {of} from 'rxjs/observable/of';
import {GlasgowDataManagerService} from '../../_services';
import {District} from '../../_models/District';

describe('GlasgowMapComponent', () => {
  let component: GlasgowMapComponent;
  let fixture: ComponentFixture<GlasgowMapComponent>;

  beforeEach(async(() => {
    const glasgowSpy = jasmine.createSpyObj('GlasgowDataManagerService',
      [
        'getDistricts',
        'getLoadedData',
        'getDistrict',
        'getLatestTweet',
        'getMapTopology'
      ]);
    glasgowSpy.getDistricts.and.returnValue(of(undefined));
    glasgowSpy.getLoadedData.and.returnValue(of(true));
    glasgowSpy.getDistrict.and.returnValue(of(new District()));
    glasgowSpy.getLatestTweet.and.returnValue(of(undefined));
    glasgowSpy.getMapTopology.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      declarations: [ GlasgowMapComponent ],
      providers: [
        {provide: GlasgowDataManagerService, useValue: glasgowSpy}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlasgowMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
