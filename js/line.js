function drawLineGraph() {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 50, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#historical_data")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    //Read the data
    // d3.json("https://raw.githubusercontent.com/joaquimp/gauge/master/example.json",
    d3.json("https://covidometro-dev.herokuapp.com/covidometro/indexes",

        // Now I can use this dataset:
        function (data) {
            data.results = data.results.map(d => {
                d.date = d3.timeParse("%Y-%m-%d")(d.date);
                return d;
            })

            data.results = data.results.filter(d => d.value != 0);

            var xDomain = d3.extent(data.results, function (d) { return d.date; });
            var yDomain = [20, 100];

            // Add X axis --> it is a date format
            var x = d3.scaleTime()
                .domain(xDomain)
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x)
                    .tickFormat(d3.timeFormat("%d.%m"))
                    .ticks(data.results.length)
                )
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");

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
            svg.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + height + ")")
                .call(make_x_gridlines()
                    .tickSize(-height)
                    .tickFormat("")
                )

            // add the Y gridlines
            svg.append("g")
                .attr("class", "grid")
                .call(make_y_gridlines()
                    .tickSize(-width)
                    .tickFormat(""));

            // add fases
            svg.append("g")
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
            svg.append("path")
                .datum(data.results)
                .attr("class", "line")
                .attr("d", d3.line()
                    .x(function (d) { return x(d.date) })
                    .y(function (d) { return y(d.value) }));


            // Add the points
            svg.append("g")
                .selectAll("dot")
                .data(data.results)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("cx", function (d) { return x(d.date) })
                .attr("cy", function (d) { return y(d.value) })
                .attr("r", 4);

            // Add the text
            svg.append("g")
                .selectAll("labels")
                .data(data.results)
                .enter()
                .append("text")
                .attr("class", "label")
                .attr("x", function (d) { return x(d.date) })
                .attr("y", function (d) { return y(d.value) - 20 })
                .attr("text-anchor", "middle")
                .attr("class", "shadow")
                .text(function (d) { return d.value.toFixed(1) });

            // Add the text
            svg.append("g")
                .selectAll("labels")
                .data(data.results)
                .enter()
                .append("text")
                .attr("class", "label")
                .attr("x", function (d) { return x(d.date) })
                .attr("y", function (d) { return y(d.value) - 20 })
                .attr("text-anchor", "middle")
                .text(function (d) { return d.value.toFixed(1) });
        })
}

drawLineGraph();