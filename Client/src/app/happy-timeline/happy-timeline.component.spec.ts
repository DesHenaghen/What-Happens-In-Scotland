import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyTimelineComponent } from './happy-timeline.component';
import {NvD3Module} from 'ng2-nvd3';
import {District} from '../_models/District';
import {Component} from '@angular/core';

describe('HappyTimelineComponent', () => {
  let component: HappyTimelineComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NvD3Module],
      declarations: [
        TestComponentWrapper,
        HappyTimelineComponent
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
    newDistrict.values = [{x: 100, y: 45}, {x: 101, y: 46}];
    fixture.componentInstance.ward = newDistrict;
    fixture.detectChanges();

    const barCount = fixture.debugElement.nativeElement
      .querySelectorAll('g.nv-group.nv-series-0.nv-noninteractive path').length;
    expect(barCount).toBe(2);
  });
});

@Component({
  selector: 'test-component-wrapper',
  template: '<app-happy-timeline [ward]="ward"></app-happy-timeline>'
})
class TestComponentWrapper {
  ward = new District();

}
