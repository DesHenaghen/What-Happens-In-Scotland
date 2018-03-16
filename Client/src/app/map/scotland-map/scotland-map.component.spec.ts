import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScotlandMapComponent } from './scotland-map.component';
import {of} from 'rxjs/observable/of';
import {ScotlandDataManagerService} from '../../_services';
import {District} from '../../_models/District';

describe('ScotlandMapComponent', () => {
  let component: ScotlandMapComponent;
  let fixture: ComponentFixture<ScotlandMapComponent>;

  beforeEach(async(() => {
    const scotlandSpy = jasmine.createSpyObj('ScotlandDataManagerService',
      [
        'getDistricts',
        'getLoadedData',
        'getDistrict',
        'getLatestTweet',
        'getMapTopology'
      ]);
    scotlandSpy.getDistricts.and.returnValue(of(undefined));
    scotlandSpy.getLoadedData.and.returnValue(of(true));
    scotlandSpy.getDistrict.and.returnValue(of(new District()));
    scotlandSpy.getLatestTweet.and.returnValue(of(undefined));
    scotlandSpy.getMapTopology.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      declarations: [ ScotlandMapComponent ],
      providers: [
        {provide: ScotlandDataManagerService, useValue: scotlandSpy}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScotlandMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
