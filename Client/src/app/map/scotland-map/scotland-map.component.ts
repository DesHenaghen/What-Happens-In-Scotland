import {Component, ViewEncapsulation} from '@angular/core';

declare let d3: any;
import {ScotlandDataManagerService} from '../../_services/index';
import {MapComponent} from '../map.component';

/**
 * Component for the generation and management of the Scotland Map
 */
@Component({
  selector: 'app-scotland-map',
  templateUrl: '../map.component.html',
  styleUrls: ['../map.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ScotlandMapComponent extends MapComponent {

  public regionMap = 'scotland-map';

  constructor(private _scotlandDataManager: ScotlandDataManagerService) {
    super();
    this._dataManager = _scotlandDataManager;
  }

  protected initVariables (): void {

    this.projection = d3.geo.albers()
      .center([-0.9959, 57.80153])
      .rotate([3.1, 0])
      .parallels([50, 60])
      .scale(8500)
      .translate([this.width / 2, this.height / 2]);

    this.offsetT = document.getElementById('map-background')
                  ? document.getElementById('map-background').offsetTop - 20
                  : 0;
  }
}
