import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
  '../assets/css/sticky-footer.css']
})
export class AppComponent implements OnInit {
  public value = 0;
  public paused = true;

  constructor() { }

  public ngOnInit(): void {
    setInterval(() => {
      if (this.paused && this.value > 0) {
        this.value--;
      } else if (!this.paused && this.value < 100) {
        this.value++;
      }
    }, 1000);
  }

  public togglePaused(): void {
    this.paused = !this.paused;
  }
}
