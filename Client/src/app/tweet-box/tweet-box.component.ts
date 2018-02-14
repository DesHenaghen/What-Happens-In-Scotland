import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {District} from '../_models/District';

declare let d3: any;

@Component({
  selector: 'app-tweet-box',
  templateUrl: './tweet-box.component.html',
  styleUrls: ['./tweet-box.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TweetBoxComponent implements OnInit, OnChanges {
  @Input() ward: District;

  private colour: any;

  constructor() {
    this.colour = d3.scale.linear()
      .domain([-1, /*-0.1, 0.1,*/0, 1])
      .range(['#ff000c', /*'#8f8f8f',*/ '#b2b2b2', '#0500ff']);
  }

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['ward']) {
      // console.log(this.ward);
    }
  }

  public getTweetBorder(score: number): string {
    return '2px solid ' + this.colour(score);
  }

}
