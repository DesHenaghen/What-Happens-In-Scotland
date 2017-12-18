import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import * as d3 from 'd3';
import * as topojson from 'topojson';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class HomeComponent implements OnInit {
  public ward = 'Glasgow';
  private wards = {};

  private margin = {top: 20, right: 20, bottom: 0, left: 50};
  private height: number;
  private width: number;
  private svg: any;
  private g: any;
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
    this.drawMap();
  }

  private initVariables = (): void => {

    this.projection = d3.geoAlbers()
      .center([-0.15, 55.8642])
      .rotate([4.1, 0])
      .parallels([50, 60])
      .scale(250000)
      .translate([this.width / 2, this.height / 2]);

    this.colour = d3.scaleLinear()
      .domain([0, 6])
      .range(['#5b5858', '#4f4d4d', '#454444', '#323131']);

    // Create svg for graph to be drawn in
    this.svg = d3.select('#map')
      .append('svg')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height)
      .attr('id', 'mapp');

    this.offsetL = document.getElementById('map').offsetLeft + 10;
    this.offsetT = document.getElementById('map').offsetTop + 10;

    this.path = d3.geoPath().projection(this.projection);

    this.tooltip = d3.select('#map')
      .append('div')
      .attr('class', 'tooltip hidden');

    this.g = this.svg.append('g');
  }

  private drawMap = (): void => {
    d3.json('./assets/json/glasgow-wards.json', (error, topology) => {
      if (error) {
        console.error(error);
      } else {
        console.log(topology);

        this.loadWards(topology);

        // Draw each ward polygon
        this.drawWards(topology);

        this.drawGlasgowOutline(topology);
      }
    });
  }

  private loadWards = (topology: any): void => {
    topology.features.forEach(feature => {
      this.wards[feature.properties.WD13CD] = feature.properties.WD13NM;
    });

    this.wards['glasgow-boundary'] = 'Glasgow';
  }

  private drawWards = (topology: any): void => {
    this.g.selectAll('path')
      .data(topology.features) // Read in the array of features from the topology data
      .enter()
      .append('path') // Add a path element
      // With classes wards and ward id
      .attr('class', d => 'wards ' + d.properties.WD13CD)
      // Define the outline of the shape based on the defined projection and polygon shape
      .attr('d', this.path)
      // Fill the polygon in with a colour from a range
      .attr('fill', (d, i) => this.colour(i))
      .attr('id', d => d.properties.WD13CD)
        .on('click', this.setWards)
        .on('mousemove', this.showTooltip)
        .on('mouseout', () => {
          this.tooltip.classed('hidden', true);
        });
  }

  private drawGlasgowOutline = (t: any): void => {
    const topology = topojson.topology([t], null);
    this.svg.append('path')
      // Only returns the arcs that aren't shared by wards i.e the outer bounds
      .datum(topojson.mesh(topology, topology.objects[0], (a, b) => a === b ))
      .attr('d', this.path)
      .attr('id', 'glasgow-boundary')
      .attr('class', 'selected')
        .on('click', this.setWards)
        .on('mousemove', this.showTooltip)
        .on('mouseout', () => {
          this.tooltip.classed('hidden', true);
        });
  }

  /**
   * Sets the target of the click event to be active. Sets active area on the map.
   * @param {Event} e
   */
  private setWards = (e: any): void => {
    this.clearSelectedClass();
    const id = e.properties ? e.properties.WD13CD : 'glasgow-boundary';
    this.ward = this.wards[id];
    document.getElementById(id).classList.add('selected');
  }

  private clearSelectedClass = (): void => {
    for (const [key] of Object.entries(this.wards)) {
      document.getElementById(key).classList.remove('selected');
    }
  }

  private showTooltip = (d: any): void => {
    const label = d.properties ? d.properties.WD13NM : 'Glasgow';
    const mouse = d3.mouse(this.svg.node());
    console.log(mouse, this.offsetL, this.offsetT);
    this.tooltip.classed('hidden', false)
      .attr('style', 'left:' + (mouse[0] + this.offsetL) + 'px;top:' + (mouse[1] + this.offsetT) + 'px')
      .html(label);
  }
}

