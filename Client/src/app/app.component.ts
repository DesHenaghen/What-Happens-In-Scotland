import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
  '../assets/css/sticky-footer.css']
})
export class AppComponent {
  constructor() { }

  public hideIntroBox() {
    document.getElementById('intro-box').style.display = 'none';
  }
}
