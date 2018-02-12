import {Component, ViewEncapsulation} from '@angular/core';

declare let d3: any;
import {GlasgowDataManagerService} from '../../_services/index';
import {MapComponent} from '../map.component';

/**
 * Component for the generation and management of the Glasgow Map
 */
@Component({
  selector: 'app-glasgow-map',
  templateUrl: '../map.component.html',
  styleUrls: ['../map.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GlasgowMapComponent extends MapComponent {

  public regionMap = 'glasgow-map';

  constructor(private _glasgowDataManager: GlasgowDataManagerService) {
    super();
    this._dataManager = this._glasgowDataManager;
  }

  protected initVariables(): void {
    this.projection = d3.geo.albers()
      .center([-0.139, 55.8642])
      .rotate([4.1, 0])
      .parallels([50, 60])
      .scale(280000)
      .translate([this.width / 2, this.height / 2]);

    this.offsetT = document.getElementById('glasgow-map').offsetTop + 50;
  }

}
