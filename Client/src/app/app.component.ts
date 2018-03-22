import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {HomeComponent} from './home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
  '../assets/css/sticky-footer.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  @ViewChild(HomeComponent) home: HomeComponent;

  public endDate: Date;
  public period: number;
  public minDate = new Date(2017, 11, 1);
  public maxDate = new Date();

  constructor() {  }

  ngOnInit() {
    this.endDate = new Date;
    this.period = 3;
  }

  public submitDate(): void {
    this.home.refreshData();
  }

  public hideIntroBox(): void {
    document.getElementById('intro-box').style.display = 'none';
  }
}
