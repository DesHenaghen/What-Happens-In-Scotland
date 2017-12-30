import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlasgowMapComponent } from './glasgow-map.component';

describe('GlasgowMapComponent', () => {
  let component: GlasgowMapComponent;
  let fixture: ComponentFixture<GlasgowMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlasgowMapComponent ]
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
