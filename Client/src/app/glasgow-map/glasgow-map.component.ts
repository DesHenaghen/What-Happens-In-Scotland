import {Component, OnInit, ViewEncapsulation} from '@angular/core';

declare let d3: any;
import * as topojson from 'topojson';
import {GlasgowDataManagerService} from '../_services';
import {District} from '../_models/District';
import {Tweet} from '../_models/Tweet';
import {Feature, FeatureCollection, MultiLineString} from 'geojson';

/**
 * Component for the generation and management of the Glasgow Map
 */
@Component({
  selector: 'app-glasgow-map',
  templateUrl: './glasgow-map.component.html',
  styleUrls: ['./glasgow-map.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GlasgowMapComponent implements OnInit {

  // TODO: Models
  public ward: District;
  public wards: { [id: string]: District };

  private margin = {top: 20, right: 20, bottom: 0, left: 50};
  private height: number;
  private width: number;
  private svg: any;
  private colour: any;
  private projection;
  private path: number;
  private tooltip: any;
  private offsetL: number;
  private offsetT: number;

  constructor(private _glasgowDataManager: GlasgowDataManagerService) {
    this.width = 1100 - this.margin.left - this.margin.right;
    this.height = 1000 - this.margin.top - this.margin.bottom;
  }

  public ngOnInit(): void {
    this.initVariables();

    this._glasgowDataManager.getDistricts()
      .subscribe((districts: { [id: string]: District }) => this.wards = districts);

    this._glasgowDataManager.getDistrict().subscribe((district: District) => this.ward = district);

    this._glasgowDataManager.getLatestTweet().subscribe((tweet: Tweet) => {
      if (tweet !== undefined) {
        if (tweet.id === ('glasgow-boundary')) {
          const element = document.getElementById(tweet.id);
          if (element.style.animationName === 'pulsate') {
            element.style.animationName = 'pulsate2';
          } else {
            element.style.animationName = 'pulsate';
          }
        } else {
          this.drawPoint(tweet.coordinates);
        }
      }
    });

    this._glasgowDataManager.getMapTopology().subscribe((topology: FeatureCollection<any>) => this.drawMap(topology));
  }

  /**
   *
   */
  private initVariables(): void {

    this.projection = d3.geo.albers()
      .center([-0.144, 55.8642])
      .rotate([4.1, 0])
      .parallels([50, 60])
      .scale(300000)
      .translate([this.width / 2, this.height / 2]);

    this.colour = d3.scale.linear()
      .domain([-1, /*-0.1, 0.1,*/0, 1])
      .range(['#ff000c', /*'#8f8f8f',*/ '#b2b2b2', '#0500ff']);

    // Create svg for graph to be drawn in
    this.svg = d3.select('#map')
      .append('svg')
      .attr('id', 'mapp')
      // Makes map resizeable
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.offsetL = document.getElementById('map').offsetLeft + 20;
    this.offsetT = document.getElementById('map').offsetTop + 20;

    this.path = d3.geo.path().projection(this.projection);

    this.tooltip = d3.select('#map')
      .append('div')
      .attr('class', 'tooltip hidden');

  }

  /**
   * Draws map when topology has been parsed
   * @param topology
   */
  public drawMap(topology: FeatureCollection<any>): void {
    if (topology !== undefined) {
      // Draw map outline
      this.drawGlasgowOutline(topology);

      // Draw each ward polygon
      this.drawWards(topology);
    }
  }

  /**
   * Draws the wards that exist in the topology passed in.
   * @param topology
   */
  private drawWards(topology: FeatureCollection<any>): void {
    this.svg.append('g').selectAll('path')
      .data(topology.features) // Read in the array of features from the topology data
      .enter()
      .append('path') // Add a path element
      // With classes wards and ward id
      .attr('class', d => 'wards ' + d.properties.WD13CD)
      // Define the outline of the shape based on the defined projection and polygon shape
      .attr('d', this.path)
      // Fill the polygon in with a colour from a range
      .attr('fill', d => this.colour(this.wards[d.properties.WD13CD].average))
      .attr('id', d => d.properties.WD13CD)
      .on('click', this.setData)
      .on('mousemove', this.showTooltip)
      .on('mouseout', () => {
        this.tooltip.classed('hidden', true);
      });
  }

  /**
   * Draws the outline of the ward in the topology passed in. Only draws outer boundaries
   * @param t
   */
  private drawGlasgowOutline(t: FeatureCollection<any>): void {
    const topology = topojson.topology([t], null);
    this.svg.append('path')
    // Only returns the arcs that aren't shared by wards i.e the outer bounds
      .datum(topojson.mesh(topology, topology.objects[0], (a, b) => a === b))
      .attr('d', this.path)
      .attr('stroke', () => this.colour(this.wards['glasgow-boundary'].average))
      .attr('id', 'glasgow-boundary')
      .attr('class', 'selected')
      .on('click', this.setData)
      .on('mousemove', this.showTooltip)
      .on('mouseout', () => {
        this.tooltip.classed('hidden', true);
      });
  }

  private drawPoint(coordArray: number[]): void {
    const coordinates = this.projection(coordArray);
    this.svg
      .append('circle')
      .attr('id', ('c' + coordinates[0] + coordinates[1]).replace(/\./g, ''))
      .attr('cx', () => coordinates[0])
      .attr('cy', () => coordinates[1])
      .attr('r', '4px')
      .attr('fill', '#2a2727')
      .call(d => this.circlePulse(d[0][0]));
  }

  private circlePulse = (d: any): void => {
    this.svg.select('#' + d.id)
      .transition()
      .duration(2000)
      .attr('stroke-width', 0.5)
      .attr('r', 12)
      .ease('sine');
    // .transition()
    // .duration(5000)
    // .attr('stroke-width', 10)
    // .attr('r', 0)
    // .remove();
  }

  // Event Handlers //

  /**
   * Emits the id of the selected ward
   * @param e
   */
  private setData = (e: Feature<any> | MultiLineString): void => {
    const id = this.isFeature(e) ? e.properties.WD13CD : 'glasgow-boundary';
    this._glasgowDataManager.setDistrict(id);
  }

  /**
   * Displays the tooltip for the ward hovered over at the appropriate place on the screen
   * @param d
   */
  private showTooltip = (d: Feature<any> | MultiLineString): void => {
    const label = (this.isFeature(d) ? d.properties.WD13NM : 'Glasgow') +
      '<br> ' + this.wards[this.isFeature(d) ? d.properties.WD13CD : 'glasgow-boundary'].prettyAverage + '% Happy';
    const mouse = d3.mouse(this.svg.node());
    // console.log(mouse, this.offsetL, this.offsetT);
    this.tooltip.classed('hidden', false)
      .attr('style', 'left:' + (mouse[0] + this.offsetL) + 'px;top:' + (mouse[1] + this.offsetT) + 'px')
      .html(label);
  }

  private isFeature(object: any): object is Feature<any> {
    return 'properties' in object;
  }
}
