import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import * as d3 from 'd3';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class HomeComponent implements OnInit {
  ward = 'Glasgow';
  private wards = {};

  private margin = {top: 20, right: 20, bottom: 0, left: 50};
  private height: number;
  private width: number;
  private svg: any;
  private g: any;
  private colour: any;
  private projection;
  private path: number;

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
      .attr('viewBox', '0 0 ' + this.width + ' ' + this.height);

    this.path = d3.geoPath().projection(this.projection);

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

        // Place labels over each ward
        // this.drawWardLabels(topology);

        this.attachClickListeners(topology);
      }
    });
  }

  private loadWards = (topology: any): void => {
    topology.features.forEach(feature => {
      this.wards[feature.properties.WD13CD] = feature.properties.WD13NM;
    });
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
      .attr('id', d => d.properties.WD13CD);
  }

  private drawWardLabels = (topology: any): void => {
    this.g.selectAll('.place-label')
      .data(topology.features) // Read in the array of features from the topology data
      .enter().append('text') // Add a text element
      .attr('class', 'place-label')
      // Start the text at the centre of the polygon
      .attr('transform', d => 'translate(' + this.projection(d3.polygonCentroid(d.geometry.coordinates[0])) + ')')
      // Text size
      .attr('dy', '.35em')
      // Text value
      .text(d => d.properties.WD13NM);
  }


  private attachClickListeners = (topology: any): void => {
    topology.features.forEach(f =>
      document.getElementById(f.properties.WD13CD)
        .addEventListener('click', this.setWards)
    );

    document.getElementById('map-background')
      .addEventListener('click', this.setWards);
    // document.getElementById('').addEventListener("click", function (f) {alert('xss')});
  }

  private setWards = (e: Event): void => {
    this.clearSelectedClass();
    const target: any = e.target;
    if (target.id) {
      this.ward = this.wards[target.id];
      document.getElementById(target.id).classList.add('selected');
    } else {
      this.ward = 'Glasgow';
    }
  }

  private clearSelectedClass = (): void => {
    for (const [key] of Object.entries(this.wards)) {
      document.getElementById(key).classList.remove('selected');
    }
  }
}

