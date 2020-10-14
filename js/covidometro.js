var covidometroURL = "https://covidometro-dev.herokuapp.com/covidometro/indexes"; // Remote Data
// var covidometroURL = "../example.json"; // Local Data

function drawCovidometro() {
    var isGaugeDrawable = false;
    var isLineDrawable = false;

    function drawGaugeGraph(data) {
        if (!isGaugeDrawable) return;
        gaugeChart('#power-gauge', data);
    }
    
    function drawLineGraph(data) {
        if (!isLineDrawable) return;
        lineChart('#historical_data', data);
    }

    function config(gaugeID, lineID) {
        var covidometroGauge = jQuery(gaugeID);
        var covidometroLine = jQuery(lineID)

        if (covidometroGauge.length > 0) {
            covidometroGauge.append('<div id="power-gauge"></div>');
            covidometroGauge.append('<div id="legends"></div>');
            covidometroGauge.attr("style", "display: flex;");
            isGaugeDrawable = true;
        }
        if (covidometroLine.length > 0) {
            covidometroLine.append('<div id="historical_data"></div>');
            isLineDrawable = true;
        }
    }

    function start(gaugeID, lineID, parametersTableID) {
        config(gaugeID, lineID);

        if (!isGaugeDrawable && !isLineDrawable) return;

        d3.json(covidometroURL, function (data) {
                drawLineGraph(data);
                drawGaugeGraph(data);
                parametersTable(parametersTableID, data);
            }
        )
    }

    return {
        start
    }
}