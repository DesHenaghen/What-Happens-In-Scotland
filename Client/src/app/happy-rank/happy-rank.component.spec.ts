import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyRankComponent } from './happy-rank.component';

describe('HappyRankComponent', () => {
  let component: HappyRankComponent;
  let fixture: ComponentFixture<HappyRankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HappyRankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HappyRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
