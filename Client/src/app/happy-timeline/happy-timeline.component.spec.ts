import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyTimelineComponent } from './happy-timeline.component';

describe('HappyTimelineComponent', () => {
  let component: HappyTimelineComponent;
  let fixture: ComponentFixture<HappyTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HappyTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HappyTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
