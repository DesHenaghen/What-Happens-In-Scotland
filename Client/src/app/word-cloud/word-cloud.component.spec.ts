import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordCloudComponent } from './word-cloud.component';
import {DataManagerService} from '../_services';
import {of} from 'rxjs/observable/of';
import {District} from '../_models/District';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

class MockDataManager {
  private district = new BehaviorSubject(undefined);

  constructor() {
    const newDistrict = new District();
    newDistrict.common_emote_words = [
      'test, 2, 345',
      'test2, 3, 234',
      'test3, -1, 160'
    ];
    this.district.next(newDistrict);
  }

  getDataManager = () => of({});
  getDistrict = () => this.district.asObservable();
  setDistrict = (d) => {
    const newDistrict = new District();
    newDistrict.common_emote_words = [
      'test, 2, 345',
    ];
    this.district.next(newDistrict);
  }
}

describe('WordCloudComponent', () => {
  let component: WordCloudComponent;
  let fixture: ComponentFixture<WordCloudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WordCloudComponent
      ],
      providers: [
        {provide: DataManagerService, useClass: MockDataManager}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should draw the word cloud', () => {
    const textCount = fixture.debugElement.nativeElement.querySelectorAll('div#wordcloud svg g text').length;
    expect(textCount).toBe(3);
  });

  it('should update the word cloud', () => {
    component._dataManager.setDistrict('');
    fixture.detectChanges();

    setInterval(() => {
      const textCount = fixture.debugElement.nativeElement.querySelectorAll('div#wordcloud svg g text');
      expect(textCount.length).toBe(1);
    }, 100);
  });
});
