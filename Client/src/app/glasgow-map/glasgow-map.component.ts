import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';

declare let d3: any;
import * as topojson from 'topojson';

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

  // Emits the id of the ward selected on the map to parent components
  @Output() wardSelected = new EventEmitter<string>();

  public wards = {};

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

  constructor() {
    this.width = 1000 - this.margin.left - this.margin.right;
    this.height = 800 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.initVariables();
  }

  /**
   *
   */
  private initVariables (): void {

    this.projection = d3.geo.albers()
      .center([-0.15, 55.8642])
      .rotate([4.1, 0])
      .parallels([50, 60])
      .scale(250000)
      .translate([this.width / 2, this.height / 2]);

    this.colour = d3.scale.linear()
      .domain([0, 0.48, 0.52, 1])
      .range(['#ff000c', '#8f8f8f', '#b2b2b2', '#0500ff']);

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
  public drawMap (topology: any): void {
      // Draw map outline
      this.drawGlasgowOutline(topology);

      // Draw each ward polygon
      this.drawWards(topology);

      this.drawPoints();
      setInterval(() => {this.drawPoints(); console.log('Drawing point'); }, this.randomNumber(1000, 5000));
  }

  /**
   * Draws the wards that exist in the topology passed in.
   * @param topology
   */
  private drawWards (topology: any): void {
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
  private drawGlasgowOutline (t: any): void  {
    const topology = topojson.topology([t], null);
    this.svg.append('path')
    // Only returns the arcs that aren't shared by wards i.e the outer bounds
      .datum(topojson.mesh(topology, topology.objects[0], (a, b) => a === b ))
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

  private drawPoints(): void {
    const coordinates = this.projection([this.randomNumber(-4.33, -4.18), this.randomNumber(55.834, 55.889)]);
    this.svg
      .append('circle')
      .attr('id', ('c' + coordinates[0] + coordinates[1]).replace(/\./g, ''))
      .attr('cx', () => coordinates[0])
      .attr('cy', () => coordinates[1])
      .attr('r', '4px')
      .attr('fill', '#2a2727')
      .call(d => this.circlePulse(d[0][0]));
  }

  private randomNumber(min: number, max: number): number {
      return Math.random() * (max - min) + min;
  }

  private circlePulse = (d: any): void => {
    this.svg.select('#' + d.id)
      .transition()
      .duration(2000)
      .attr('stroke-width', 0.5)
      .attr('r', 12)
      .ease('sine')
      .transition()
      .duration(5000)
      .attr('stroke-width', 10)
      .attr('r', 0)
      .remove();
  }

  // Event Handlers //

  /**
   * Emits the id of the selected ward
   * @param e
   */
  private setData = (e: any): void => {
    this.wardSelected.emit(e.properties ? e.properties.WD13CD : 'glasgow-boundary');
  }

  /**
   * Displays the tooltip for the ward hovered over at the appropriate place on the screen
   * @param d
   */
  private showTooltip = (d: any): void => {
    const label = (d.properties ? d.properties.WD13NM : 'Glasgow') +
      '<br> ' + this.wards[d.properties ? d.properties.WD13CD : 'glasgow-boundary'].prettyAverage + '% Happy';
    const mouse = d3.mouse(this.svg.node());
    // console.log(mouse, this.offsetL, this.offsetT);
    this.tooltip.classed('hidden', false)
      .attr('style', 'left:' + (mouse[0] + this.offsetL) + 'px;top:' + (mouse[1] + this.offsetT) + 'px')
      .html(label);
  }
}
