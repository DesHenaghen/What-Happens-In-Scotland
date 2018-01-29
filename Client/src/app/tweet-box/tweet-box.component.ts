import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {District} from '../_models/District';

@Component({
  selector: 'app-tweet-box',
  templateUrl: './tweet-box.component.html',
  styleUrls: ['./tweet-box.component.css']
})
export class TweetBoxComponent implements OnInit, OnChanges {
  @Input() ward: District;

  constructor() { }

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['ward']) {
      // console.log(this.ward);
    }
  }

}
