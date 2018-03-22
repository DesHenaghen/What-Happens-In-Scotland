import {AfterViewInit, EventEmitter, OnInit, Output} from '@angular/core';

declare let d3: any;
import * as topojson from 'topojson';
import {District} from '../_models/District';
import {Feature, FeatureCollection, MultiLineString} from 'geojson';
import {Tweet} from '../_models/Tweet';
import {isNumber} from 'util';
import {DataManagerInterface} from '../_interfaces/data-manager.interface';
import {MapModes} from '../_models/MapModes';
import {Colour} from '../_models/Colour';

export abstract class MapComponent implements OnInit, AfterViewInit {

  @Output()
  mapMode: EventEmitter<number> = new EventEmitter<number>();

  // Map variables
  public regionMap: string;
  public loaded = false;
  public district: District = new District();
  public districts: { [id: string]: District } = {};

  protected margin = {top: 20, right: 20, bottom: 0, left: 50};
  protected height: number;
  protected width: number;
  public svg: any;
  protected projection;
  protected path: number;
  protected tooltip: any;
  protected offsetT: number;

  protected mapModeMapping = {
    'S12000046': MapModes.Glasgow,
    'S12000036': MapModes.Edinburgh
  };

  public _dataManager: DataManagerInterface;

  constructor() {
    this.width = 1000 - this.margin.left - this.margin.right;
    this.height = 1000 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this._dataManager.getDistricts()
      .subscribe((districts: { [id: string]: District }) => {
        this.districts = districts;
        if (this.districts)
          this.updateMapColours();
      });

    this._dataManager.getLoadedData()
      .subscribe((loaded: boolean) => {
        this.loaded = loaded;
      });

    this._dataManager.getDistrict().subscribe((district: District) => {
      this.district = district;

      if (district)
        this.setStyling(district.id);
    });

    this._dataManager.getLatestTweet().subscribe((tweet: Tweet) => {
      if (tweet !== undefined) {
        if (tweet.id !== (this._dataManager.getMapBoundaryId())) {
          if (tweet.coordinates)
            this.drawPoint(tweet.coordinates);

          this.pulsateDistrictElement(tweet.id);
        }

        if (this._dataManager.allowRegionPulsing) {
          this.pulsateRegionElement();
        }
      }
    });

    this._dataManager.getMapTopology().subscribe((topology: FeatureCollection<any>) => this.topologySubscription(topology));
  }

  ngAfterViewInit() {
    this.initVariables();
    this.sharedInit();
  }

  private topologySubscription(topology: FeatureCollection<any>) {
    if (topology) {
      if (this.districts)
        this.drawMap(topology);
      else
        setInterval(this.topologySubscription(topology), 500);
    }
  }

  public canZoomIn() {
    return this.mapModeMapping.hasOwnProperty(this.district.id);
  }

  public zoomMapIn() {
    if (this.mapModeMapping.hasOwnProperty(this.district.id)) {
      this.mapMode.emit(this.mapModeMapping[this.district.id]);
    }
  }

  public zoomMapOut() {
    this.mapMode.emit(MapModes.Scotland);
  }

  private sharedInit() {

    // Create svg for graph to be drawn in
    this.svg = d3.select('#' + this.regionMap)
      .append('svg')
      .attr('id', this._dataManager.mapType + '-mapp')
      .attr('class', 'svgMap')
      // Makes map resizeable
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.path = d3.geo.path().projection(this.projection);

    this.tooltip = d3.select('#' + this.regionMap)
      .append('div')
      .attr('class', 'tooltip hidden');
  }

  private pulsateRegionElement(): void {
    const element = document.getElementById(this._dataManager.getMapBoundaryId());
    if (element) {
      if (element.style.animationName === 'regionPulsate') {
        element.style.animationName = 'regionPulsate2';
      } else {
        element.style.animationName = 'regionPulsate';
      }
    }
  }

  private pulsateDistrictElement(id): void {
    const element = document.getElementById(id);
    if (element) {
      if (element.style.animationName === 'districtPulsate') {
        element.style.animationName = 'districtPulsate2';
      } else {
        element.style.animationName = 'districtPulsate';
      }
    }
  }

  /**
   *
   */
  protected abstract initVariables(): void;

  /**
   * Draws map when topology has been parsed
   * @param topology
   */
  public drawMap(topology: FeatureCollection<any>): void {
    if (topology !== undefined) {
      // Draw map outline
      this.drawRegionOutline(topology);

      // Draw each district polygon
      this.drawDistricts(topology);

      this.renderLegend();
    }
  }

  /**
   *
   */
  public renderLegend(): void {

    const legend = this.svg.selectAll('g.legend')
      .data(Colour.getColourDomain())
      .enter().append('g')
      .attr('class', 'legend');

    const ls_w = 30, ls_h = 30;

    legend.append('rect')
      .attr('x', this.width - (ls_w * 6))
      .attr('y', (d, i) => this.height - (i * ls_h) - 2 * ls_h)
      .attr('width', ls_w)
      .attr('height', ls_h)
      .style('fill', (d, i) => Colour.getColour(d))
      .style('opacity', 0.8);

    legend.append('text')
      .attr('x', this.width - (ls_w * 4.5))
      .attr('y', (d, i) => this.height - (i * ls_h) - ls_h - 4)
      .text((d, i) => Colour.getColourDomainLabels()[i]);

    legend.append('text')
      .attr('x', this.width - (ls_w * 6))
      .attr('y', () => this.height - (Colour.getColourDomain().length * ls_h) - ls_h - 4)
      .text('Percent Positive');
  }

  /**
   * Draws the districts that exist in the topology passed in.
   * @param topology
   */
  private drawDistricts(topology: FeatureCollection<any>): void {
    this.svg.append('g').selectAll('path')
      .data(topology.features) // Read in the array of features from the topology data
      .enter()
      .append('path') // Add a path element
      // With classes districts and district id
      .attr('class', d => 'districts ' + d.properties[this._dataManager.topologyId])
      // Define the outline of the shape based on the defined projection and polygon shape
      .attr('d', this.path)
      // Fill the polygon in with a colour from a range
      .attr('fill', d => {
        const average = (this.districts.hasOwnProperty(d.properties[this._dataManager.topologyId]))
                          ? this.districts[d.properties[this._dataManager.topologyId]].average
                          : 50;
        return Colour.getColour(average);
      })
      .attr('id', d => d.properties[this._dataManager.topologyId])
      .on('click', this.setData)
      .on('dblclick', this.changeMap)
      .on('mousemove', this.showTooltip)
      .on('mouseout', () => {
        this.tooltip.classed('hidden', true);
      });
  }

  private updateMapColours() {
    if (this.svg) {
      for (const [key, value] of Object.entries(this.districts)) {
        this.svg
          .select('path#' + key)
          .attr((key === this._dataManager.getMapBoundaryId()) ? 'stroke' : 'fill', () => Colour.getColour(value.average));
      }
    }
  }

  /**
   * Draws the outline of the district in the topology passed in. Only draws outer boundaries
   * @param t
   */
  private drawRegionOutline (t: any): void  {
    const topology = topojson.topology([t], null);
    this.svg.append('path')
    // Only returns the arcs that aren't shared by districts i.e the outer bounds
      .datum(topojson.mesh(topology, topology.objects[0], (a, b) => a === b ))
      .attr('d', this.path)
      .attr('stroke', () => Colour.getColour(this.districts[this._dataManager.getMapBoundaryId()].average))
      .attr('id', this._dataManager.getMapBoundaryId())
      .attr('class', 'boundary selected')
      .on('click', this.setData)
      .on('mousemove', this.showTooltip)
      .on('mouseout', () => {
        this.tooltip.classed('hidden', true);
      });
  }

  public drawPoint(coordArray: number[]): void {
    if (isNumber(coordArray[0])) {
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
  }

  private circlePulse = (d: any): void => {
    this.svg.select('#' + d.id)
      .transition()
      .duration(2000)
      .attr('stroke-width', 0.5)
      .attr('r', 12)
      .ease('sine')
      .transition()
      .duration(20000)
      .attr('stroke-width', 10)
      .attr('r', 0)
      .remove();
  }

  // Event Handlers //

  /**
   * Emits the id of the selected district
   * @param e
   */
  private setData = (e: Feature<any> | MultiLineString): void => {
    const id = this.isFeature(e) ? e.properties[this._dataManager.topologyId] : this._dataManager.getMapBoundaryId();
    this._dataManager.setDistrict(id);
  }

  private changeMap = (e: Feature<any> | MultiLineString): void => {
    const id = this.isFeature(e) ? e.properties[this._dataManager.topologyId] : this._dataManager.getMapBoundaryId();
    if (id === this._dataManager.districtId) {
      this.mapMode.emit(this._dataManager.mapMode);
    }
  }

  /**
   * Displays the tooltip for the district hovered over at the appropriate place on the screen
   * @param d
   */
  private showTooltip = (d: any): void => {
    const id = d.properties ? d.properties[this._dataManager.topologyId] : this._dataManager.getMapBoundaryId();
    const label = (d.properties ? d.properties[this._dataManager.topologyName] : this._dataManager.regionName) +
      '<br> ' + this.districts[id].prettyAverage + '% Positive';

    const e = d3.event;
    this.tooltip.classed('hidden', false)
      .attr('style', 'left:' + (e.layerX + 10) + 'px;top:' + (e.layerY + this.offsetT) + 'px')
      .html(label);
  }

  private isFeature(object: any): object is Feature<any> {
    return 'properties' in object;
  }

  /**
   * Sets the css styling based on which ward is selected.
   * @param {string} area - id of the selected ward
   */
  private setStyling(area: string): void {
    if (area) {
      this.clearSelectedClass();
      if (document.getElementById(area))
        document.getElementById(area).classList.add('selected');
    }
  }

  /**
   * Removes the selected class from all wards drawn on the map
   */
  private clearSelectedClass(): void {
    if (this.districts) {
      for (const [key] of Object.entries(this.districts)) {
        if (document.getElementById(key))
          document.getElementById(key).classList.remove('selected');
      }
    }
  }
}
