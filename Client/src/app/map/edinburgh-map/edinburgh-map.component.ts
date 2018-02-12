import {Component, ViewEncapsulation} from '@angular/core';

declare let d3: any;
import {EdinburghDataManagerService} from '../../_services/index';
import {MapComponent} from '../map.component';

/**
 * Component for the generation and management of the Glasgow Map
 */
@Component({
  selector: 'app-edinburgh-map',
  templateUrl: '../map.component.html',
  styleUrls: ['../map.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EdinburghMapComponent extends MapComponent {

  public regionMap = 'edinburgh-map';

  constructor(private _edinburghDataManager: EdinburghDataManagerService) {
    super();
    this._dataManager = _edinburghDataManager;
  }

  protected initVariables(): void {
    this.projection = d3.geo.albers()
      .center([-0.124, 55.903251])
      .rotate([3.15, 0])
      .parallels([50, 60])
      .scale(220000)
      .translate([this.width / 2, this.height / 2]);

    this.offsetT = document.getElementById('edinburgh-map').offsetTop + 50;
  }
}
