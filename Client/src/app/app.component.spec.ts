import {TestBed, async, ComponentFixture} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {HomeComponent} from './home/home.component';
import {APP_BASE_HREF} from '@angular/common';

@Component({template: ''})
class HomeStubComponent {}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HomeComponent
      ],
      providers: [
        {provide: APP_BASE_HREF, useValue : '/' }
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
  });

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));

  it('should render title in the navbar', async(() => {
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('#navbar-brand').textContent)
      .toContain('What Happens In Scotland');
  }));

  it ('intro box should be hidden', () => {
    const hideButton = fixture.debugElement.nativeElement.querySelector('#hide_button');
    hideButton.click();

    expect(fixture.debugElement.nativeElement.querySelector('#intro-box').style.display).toBe('none');
  });
});
