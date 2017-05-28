
// data = {
//     x,
//     y
// }
var createAreaGraph = function(parent, data, yAxisLabel) {
    
    var svg = d3.select(parent);
    var margin = {top: 20, right: 20, bottom: 20, left: 40};

    var node = svg.node();
    var width = node.clientWidth - margin.left - margin.right;
    var height = node.clientHeight - margin.top - margin.bottom;
    g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var area = d3.area()
        .x(function(d) { return x(d.x); })
        .y1(function(d) { return y(d.y); });

    x.domain(d3.extent(data, function(d) { return d.x }));
    y.domain([0, d3.max(data, function(d) { return d.y; })]);
    area.y0(y(0));

    g.append("path")
        .datum(data)
        .attr("fill", "steelblue")
        .attr("d", area);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text(yAxisLabel);
};

