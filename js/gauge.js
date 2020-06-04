var gauge = function (container, configuration) {
    var that = {};
    var config = {
        size: 200,
        clipWidth: 200,
        clipHeight: 110,
        ringInset: 20,
        ringWidth: 20,

        pointerWidth: 20,
        pointerTailLength: 10,
        pointerHeadLengthPercent: 0.9,

        minValue: 0,
        maxValue: 100,

        minAngle: -90,
        maxAngle: 90,

        transitionMs: 750,
        labelFormat: d3.format('d'),
        labelInset: 10,

        sections: {
            gaugeValues: [0, 20, 70, 80, 90, 100],
            sectionsSize: [.5, .3, .1, .1],
            sectionsLegends: ['fechado', 'fase 1', 'fase 2', 'fase 3'],
            sectionsColors: ['red', 'organge', 'yellow', 'green'],
        },
    };

    var range = undefined;
    var r = undefined;
    var pointerHeadLength = undefined;
    var svg = undefined;
    var arc = undefined;
    var scale = undefined;
    var ticks = undefined;
    var tickData = undefined;
    var pointer = undefined;

    /////////////////////////////
    // Utility methods
    /////////////////////////////
    function deg2rad(deg) {
        return deg * Math.PI / 180;
    }

    function centerTranslation() {
        return 'translate(' + r + ',' + r + ')';
    }

    function isRendered() {
        return (svg !== undefined);
    }


    /////////////////////////////
    // Adjust gouge parameters
    /////////////////////////////
    function configure(configuration) {
        var prop = undefined;
        for (prop in configuration) {
            config[prop] = configuration[prop];
        }

        range = config.maxAngle - config.minAngle;
        r = config.size / 2;
        pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

        // a linear scale that maps domain values to a percent from 0..1
        scale = d3.scaleLinear()
            .range([0, 1])
            .domain([config.minValue, config.maxValue]);

        ticks = config.sections.gaugeValues;
        tickData = config.sections.sectionsSize;
        color = config.sections.sectionsColors;
        legendsText = config.sections.sectionsLegends;

        for (let i = 1; i < tickData.length; i++) {
            tickData[i] = tickData[i - 1] + tickData[i];
        }

        arc = d3.arc()
            .innerRadius(r - config.ringWidth - config.ringInset)
            .outerRadius(r - config.ringInset)
            .startAngle(function (d, i) {
                // Calculo do inicio da secao do gauge
                var ratio = tickData[i - 1] || 0;
                return deg2rad(config.minAngle + (ratio * range));
            })
            .endAngle(function (d, i) {
                // Calculo do fim da secao do gauge
                var ratio = tickData[i];
                return deg2rad(config.minAngle + (ratio * range));
            });
    }

    

    function render(newValue) {
        svg = d3.select(container)
            .append('svg')
            .attr('class', 'gauge')
            .attr('width', config.clipWidth)
            .attr('height', config.clipHeight);

        var centerTx = centerTranslation();

        var arcs = svg.append('g')
            .attr('class', 'arc')
            .attr('transform', centerTx);

        arcs.selectAll('path')
            .data(tickData)
            .enter().append('path')
            .attr('fill', function (d, i) {
                return color[i];
            })
            .attr('d', arc);

        var lg = svg.append('g')
            .attr('class', 'label')
            .attr('transform', centerTx);
        lg.selectAll('text')
            .data(ticks)
            .enter().append('text')
            .attr('transform', function (d) {
                var ratio = scale(d);
                var newAngle = config.minAngle + (ratio * range);
                return 'rotate(' + newAngle + ') translate(0,' + (config.labelInset - r) + ')';
            })
            .text(config.labelFormat);

        // Render Gauge Pointer
        var lineData = [[config.pointerWidth / 2, 0],
        [0, -pointerHeadLength],
        [-(config.pointerWidth / 2), 0],
        [0, config.pointerTailLength],
        [config.pointerWidth / 2, 0]];
        var pointerLine = d3.line().curve(d3.curveLinear)
        var pg = svg.append('g').data([lineData])
            .attr('class', 'pointer')
            .attr('transform', centerTx);
        pointer = pg.append('path')
            .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/)
            .attr('transform', 'rotate(' + config.minAngle + ')');


        //////////////////
        // Generate Legend
        
        // select the svg area
        var Svg = d3.select("#legends").append("svg")
        .attr('height', legendsText.length * 25)
        .attr('width', "150px")

        // Add one dot in the legend for each name.
        Svg.selectAll("mydots")
            .data(legendsText)
            .enter()
            .append("circle")
            .attr("cx", 7)
            // 100 is where the first dot appears. 25 is the distance between dots
            .attr("cy", function (d, i) { return 7 + i * 25 })
            .attr("r", 7)
            .style("fill", function (d, i) {
                return color[i]
            })

        // Add one dot in the legend for each name.
        Svg.selectAll("mylabels")
            .data(legendsText)
            .enter()
            .append("text")
            .attr("x", 25)
            // 100 is where the first dot appears. 25 is the distance between dots
            .attr("y", function (d, i) { return 7 + i * 25 })
            .text(function (d) { return d })
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        update(newValue === undefined ? 0 : newValue);
    }
    
    /////////////////////////////
    // Update gauge data
    /////////////////////////////
    function update(newValue, newConfiguration) {
        if (newConfiguration !== undefined) {
            configure(newConfiguration);
        }
        var ratio = scale(newValue);
        var newAngle = config.minAngle + (ratio * range);
        pointer.transition()
            .duration(config.transitionMs)
            .ease(d3.easeElastic)
            .attr('transform', 'rotate(' + newAngle + ')');
    }

    /////////////////////////////
    // Public methods
    /////////////////////////////
    that.configure = configure;
    that.isRendered = isRendered;
    that.update = update;
    that.render = render;

    
    /////////////////////////////
    // Start configuration
    /////////////////////////////
    configure(configuration);

    return that;
};