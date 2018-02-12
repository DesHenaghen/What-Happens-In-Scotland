import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScotlandMapComponent } from './scotland-map.component';

describe('ScotlandMapComponent', () => {
  let component: ScotlandMapComponent;
  let fixture: ComponentFixture<ScotlandMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScotlandMapComponent ]
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
