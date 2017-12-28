import {Component, OnInit, ViewEncapsulation} from '@angular/core';

declare let d3: any;
import 'nvd3';
import * as topojson from 'topojson';
import * as moment from 'moment';

@Component({
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css',
    // include original nvd3 styles
    '../../../node_modules/nvd3/build/nv.d3.css'
  ],
  encapsulation: ViewEncapsulation.None

})
export class HomeComponent implements OnInit {
  public ward = {};
  private wards = {};

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

  public lineOptions;
  public lineData;

  constructor() {
    this.width = 1000 - this.margin.left - this.margin.right;
    this.height = 800 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    this.initVariables();
    this.drawMap();

    this.lineOptions = {
      chart: {
        type: 'lineChart',
        yDomain: [0, 1],
        margin : {
          top: 20,
          right: 20,
          bottom: 40,
          left: 55
        },
        useInteractiveGuideline: true,
        xAxis: {
          axisLabel: 'Date',
          tickFormat: d => d3.time.format('%b %d')(new Date(d))
        },
        yAxis: {
          axisLabel: 'Happiness',
          tickFormat: d => Math.trunc(d * 100) + '%',
          axisLabelDistance: -10
        }
      }
    };
  }

  private generateData = (selectedArea?: string): any[] => {
    const area = selectedArea || 'glasgow-boundary';
    const values = [];
    const date: moment.Moment = moment().month(11).date(1);
    for (let i = 0; i < 30; i++) {
        values.push({
          x: date.valueOf(),
          y: Math.random()
        });

        date.add(1, 'day');
    }

    this.wards[area].values = values;
    this.wards[area].average = (values.reduce((a, b) => ({y: a.y + b.y})).y / values.length);
    this.wards[area].prettyAverage = Math.round(this.wards[area].average * 100);

    return values;
  }

  private setData = (selectedArea?: string): void => {
    const area = selectedArea || 'glasgow-boundary';

    // Set current ward
    this.ward = this.wards[area];

    // Line chart data should be sent as an array of series objects.
    this.lineData = [
      {
        values: (this.wards[area].values) ? this.wards[area].values : this.generateData(area),
        key: 'Happiness',
        color: '#7e91ff',
        area: true      // area - set to true if you want this line to turn into a filled area chart.
      }
    ];

    document.getElementById('chart-box').style.backgroundColor = this.colour(this.wards[area].average);
  }

  private initVariables = (): void => {

    this.projection = d3.geo.albers()
      .center([-0.15, 55.8642])
      .rotate([4.1, 0])
      .parallels([50, 60])
      .scale(250000)
      .translate([this.width / 2, this.height / 2]);

    this.colour = d3.scale.linear()
      .domain([0, 0.47, 0.53, 1])
      .range(['#ff000c', '#b2b2b2', '#8f8f8f', '#0500ff']);

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

  private drawMap = (): void => {
    d3.json('./assets/json/glasgow-wards.json', (error, topology) => {
      if (error) {
        console.error(error);
      } else {
        console.log(topology);

        this.loadWards(topology);

        this.drawGlasgowOutline(topology);

        // Draw each ward polygon
        this.drawWards(topology);
      }
    });
  }

  private loadWards = (topology: any): void => {
    topology.features.forEach(feature => {
      this.wards[feature.properties.WD13CD] = { name: feature.properties.WD13NM };
      this.generateData(feature.properties.WD13CD);
    });

    this.wards['glasgow-boundary'] = { name: 'Glasgow' };

    this.setData();
  }

  private drawWards = (topology: any): void => {
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
      .attr('stroke', () => this.colour(this.wards['glasgow-boundary'].average))
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
    this.ward = this.wards[id].name;
    this.setData(id);
    document.getElementById(id).classList.add('selected');
  }

  private clearSelectedClass = (): void => {
    for (const [key] of Object.entries(this.wards)) {
      document.getElementById(key).classList.remove('selected');
    }
  }

  private showTooltip = (d: any): void => {
    const label = (d.properties ? d.properties.WD13NM : 'Glasgow') +
      '<br> ' + this.wards[d.properties ? d.properties.WD13CD : 'glasgow-boundary'].prettyAverage + '% Happy';
    const mouse = d3.mouse(this.svg.node());
    console.log(mouse, this.offsetL, this.offsetT);
    this.tooltip.classed('hidden', false)
      .attr('style', 'left:' + (mouse[0] + this.offsetL) + 'px;top:' + (mouse[1] + this.offsetT) + 'px')
      .html(label);
  }
}

