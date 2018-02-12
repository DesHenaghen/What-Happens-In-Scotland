import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EdinburghMapComponent } from './edinburgh-map.component';

describe('EdinburghMapComponent', () => {
  let component: EdinburghMapComponent;
  let fixture: ComponentFixture<EdinburghMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EdinburghMapComponent ]
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
