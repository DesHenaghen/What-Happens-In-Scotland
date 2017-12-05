import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';

import * as t from 'topojson';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Map Page';
  subtitle = 'US Map';

  private margin = {top: 20, right: 20, bottom: 0, left: 50};
  private height: number;
  private width: number;
  private svg: any;
  private g: any;
  private colour: any;
  private projection: number;
  private path: number;

  constructor() {
    this.width = 1000 - this.margin.left - this.margin.right;
    this.height = 600 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.initVariables();
    this.drawMap();
  }

  private initVariables() {

    this.projection = d3.geoAlbers()
      .center([-0.15, 55.8642])
      .rotate([4.1, 0])
      .parallels([50, 60])
      .scale(170000)
      .translate([this.width / 2, this.height / 2]);

    this.colour = d3.scaleLinear()
      .domain([0, 6])
      .range(['#5b5858', '#4f4d4d', '#454444', '#323131']);

    this.svg = d3.select('#map').append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.path = d3.geoPath().projection(this.projection);

    this.g = this.svg.append('g');
  }

  private drawMap() {
    const localG = this.g;
    const localPath = this.path;
    const localColour = this.colour;
    const localProjection: any = this.projection;
    console.log(localProjection);
    d3.json('./assets/json/glasgow-wards.json', function(error, topology) {
      if (error) {
        console.error(error);
      } else {
        console.log(topology);
        // console.log(topology.features);

        // Draw each ward polygon
        localG.selectAll('path')
          .data(topology.features) // Read in the array of features from the topology data
          .enter()
          .append('path') // Add a path element
           // With classes wards and ward id
           .attr('class', function (d) {
             return 'wards ' + d.properties.WD13CD;
           })
          // Define the outline of the shape based on the defined projection and polygon shape
          .attr('d', localPath)
          // Fill the polygon in with a colour from a range
          .attr('fill', function (d, i) {
            return localColour(i);
          });

        // Place labels over each ward
        localG.selectAll('.place-label')
          .data(topology.features) // Read in the array of features from the topology data
          .enter().append('text') // Add a text element
          .attr('class', 'place-label')
          // Start the text at the centre of the polygon
          .attr('transform', function(d) {
            return 'translate(' + localProjection(d3.polygonCentroid(d.geometry.coordinates[0])) + ')';
          })
          // Text size
          .attr('dy', '.35em')
          // Text value
          .text(function(d) { return d.properties.WD13NM; });
      }
    });
  }
}
