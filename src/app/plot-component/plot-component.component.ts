import { Component, OnInit } from '@angular/core';

import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Brush from 'd3-brush';
import * as d3Random from 'd3-random';
import * as d3Scale from 'd3-scale';
import * as d3Selection from 'd3-selection';

@Component({
  selector: 'app-plot-component',
  templateUrl: './plot-component.component.html',
  styleUrls: ['./plot-component.component.css']
})
export class PlotComponentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var random = d3Random.randomNormal(0, 0.3),
        separation = Math.sqrt(3),
        clusterHeight = d3Random.randomNormal(0, 0.5),

        points0amt = d3Random.randomUniform(0, 337)(),
        points1amt = d3Random.randomUniform(0, 337 - points0amt)(),
        points2amt = 337 - points0amt - points1amt,

        points0 = d3Array.range(points0amt).map(function() { return [random() + separation, random() + clusterHeight(), 0]; }),
        points1 = d3Array.range(points1amt).map(function() { return [random() - separation, random() + clusterHeight(), 6]; }),
        points2 = d3Array.range(points2amt).map(function() { return [random(), random() + clusterHeight(), 8]; }),
        points = d3Array.merge([points0, points1, points2]);

    var svg = d3Selection.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    var k = height / width,
        x0 = [-4.5, 4.5],
        y0 = [-4.5 * k, 4.5 * k],
        x = d3Scale.scaleLinear().domain(x0).range([0, width]),
        y = d3Scale.scaleLinear().domain(y0).range([height, 0]),
        z = d3Scale.scaleOrdinal(d3Scale.schemeCategory20);

    var xAxis = d3Axis.axisTop(x).ticks(12),
        yAxis = d3Axis.axisRight(y).ticks(12 * height / width);

        
    var brush = d3Brush.brush().on("end", brushended),
        idleTimeout,
        idleDelay = 350;

    svg.selectAll("circle")
      .data(points)
      .enter().append("circle")
        .attr("cx", function(d) { return x(d[0]); })
        .attr("cy", function(d) { return y(d[1]); })
        .attr("r", 4)
        .attr("fill", function(d) { return z.range()[d[2]]; })
        .attr("opacity", 0.6);

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height - 10) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis axis--y")
        .attr("transform", "translate(10,0)")
        .call(yAxis);

    svg.selectAll(".domain")
        .style("display", "none");

    svg.append("g")
        .attr("class", "brush")
        .call(brush);

    function brushended() {
      var s = d3Selection.event.selection;
      if (!s) {
        if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
        x.domain(x0);
        y.domain(y0);
      } else {
        x.domain([s[0][0], s[1][0]].map(x.invert, x));
        y.domain([s[1][1], s[0][1]].map(y.invert, y));
        svg.select(".brush").call(brush.move, null);
      }
      zoom();
    }

    function idled() {
      idleTimeout = null;
    }

    function zoom() {
      var t = svg.transition().duration(750);
      svg.select(".axis--x").call(xAxis);
      svg.select(".axis--y").call(yAxis);
      svg.selectAll("circle").transition(t)
          .attr("cx", function(d) { return x(d[0]); })
          .attr("cy", function(d) { return y(d[1]); });
    }
  }
}
