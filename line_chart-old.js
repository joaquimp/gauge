function lineChart(id, data) {
    const maxWidth = 900;

    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 40, bottom: 50, left: 60 },
        width = maxWidth - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select(id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    data.results = data.results.map(d => {
        d.date = d3.timeParse("%Y-%m-%d")(d.date);
        return d;
    })

    let resultsLength = data.results.length;
    data.results = data.results.slice(0, 30)

    data.results = data.results.filter(d => d.value != 0);

    var xDomain = d3.extent(data.results, function (d) { return d.date; });
    var yDomain = [20, 100];

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
        .domain(xDomain)
        // .range([0, width]);

    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")

    // Add Y axis
    var y = d3.scaleLinear()
        .domain(yDomain)
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(x)
            .ticks(5)
    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(y)
            .ticks(5)
    }

    // add the X gridlines
    xGrid = svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        )

    // add the Y gridlines
    yGrid = svg.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat(""));

    // add fases
    var fases = svg.append("g")
        .selectAll("fases")
        .data(data.fases)
        .enter()
        .append("line")
        .attr("class", "fase_line")
        .style("stroke", function (d) { return d.color; })
        .attr("x1", function (d) { return x(x.domain()[0]); })
        .attr("x2", function (d) { return x(x.domain()[1]); })
        .attr("y1", function (d) { return y(d.limit); })
        .attr("y2", function (d) { return y(d.limit); })


    // Add the line
    var line = svg.append("path")
        .datum(data.results)
        .attr("class", "line")
        .attr("d", d3.line()
            .x(function (d) { return x(d.date) })
            .y(function (d) { return y(d.value) }));


    // Add the points
    var dots = svg.append("g")
        .selectAll("dot")
        .data(data.results)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function (d) { return x(d.date) })
        .attr("cy", function (d) { return y(d.value) })
        .attr("r", 4 * (width/maxWidth));

    // Add the text
    var legend = svg.append("g")
        .selectAll("labels")
        .data([data.results[0]])
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", function (d) { return x(d.date) + 10; })
        .attr("y", function (d) { return y(d.value) })
        // .attr("text-anchor", "middle")
        .text(function (d) { return d.value.toFixed(1) });

    function resize() {
        let currentWidth = parseInt(d3.select(id).style('width'), 10)
        currentWidth = (currentWidth > maxWidth ? maxWidth : currentWidth) - margin.left - margin.right;

        svg.attr("width", currentWidth + margin.left + margin.right);

        x.range([0, currentWidth]);
        xAxis
            .call(d3.axisBottom(x)
                .tickFormat(d3.timeFormat("%d.%m"))
                .ticks(d3.timeDay.every(2))
            )
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");

        dots
            .attr("cx", function(d) { return x(d.date)})
            .attr("r", 4 * (currentWidth / maxWidth));

        line.attr("d", d3.line()
            .x(function (d) { return x(d.date) })
            .y(function (d) { return y(d.value) }));

        xGrid
            .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat(""));
        
        yGrid
            .call(make_y_gridlines()
            .tickSize(-currentWidth)
            .tickFormat(""));

        fases
            .attr("x1", function (d) { return x(x.domain()[0]); })
            .attr("x2", function (d) { return x(x.domain()[1]); })

        legend
            .attr("x", function (d) { return x(d.date) + 10; })
        
    }

    resize();

    window.addEventListener('resize', resize);
}