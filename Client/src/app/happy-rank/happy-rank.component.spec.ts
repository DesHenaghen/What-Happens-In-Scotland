import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyRankComponent } from './happy-rank.component';
import {NvD3Module} from 'ng2-nvd3';
import {DataManagerService} from '../_services';
import {Component} from '@angular/core';
import {District} from '../_models/District';

describe('HappyRankComponent', () => {
  let component: HappyRankComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    const dataManagerSpy = jasmine.createSpyObj('DataManagerService',
      [
        'setDistrict',
        'getMapBoundaryId'
      ]);

    TestBed.configureTestingModule({
      imports: [
        NvD3Module
      ],
      declarations: [
        TestComponentWrapper,
        HappyRankComponent
      ],
      providers: [
        {provide: DataManagerService, useValue: dataManagerSpy}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redraw chart when ward changes', () => {
    const newDistrict = new District();
    newDistrict.id = 'second';
    fixture.componentInstance.wards['second'] = newDistrict;
    fixture.componentInstance.ward = newDistrict;
    fixture.detectChanges();

    const barCount = fixture.debugElement.nativeElement.querySelectorAll('g.nv-bar').length;
    expect(barCount).toBe(2);
  });
});

@Component({
  selector: 'test-component-wrapper',
  template: '<app-happy-rank [ward]="ward" [wards]="wards"></app-happy-rank>'
})
class TestComponentWrapper {
  ward = new District();
  wards = {'first': new District()};
}
