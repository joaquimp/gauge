
function onDocumentReady() {

    // const url = "data.json";
    const url = "https://covidometro-dev.herokuapp.com/covidometro/indexes";

    // Default data
    var configuration = {
        size: 300,
        clipWidth: 302,
        clipHeight: 170,
        ringWidth: 60,
        maxValue: 100,
        transitionMs: 4000,
        sections: {
            gaugeValues: [0, 50, 70, 80, 90, 100],
            sectionsSize: [.5, .2, .1, .1, .1],
            sectionsLegends: ['Fechado', 'Fase 1', 'Fase 2', 'Fase 3', 'Aberto'],
            sectionsColors: ['red', 'orange', 'yellow', 'green', 'blue'],
        },
    };

    var powerGauge = undefined;

    function start() {
        d3.json(url, function (err, json) {
            // último dado
            let index = json.results[0].value;
            let gaugeValues = [0];
            let sectionsSize = [];
            let sectionLegends = [];
            let sectionColors = [];

            for(var i=0; i<json.fases.length; i++) {
                const element = json.fases[i];
                gaugeValues.push(element.limit);
                
                if (i==0) {
                    const size = element.limit/100;
                    sectionsSize.push(size);
                } else {
                    const size = (element.limit - json.fases[i - 1].limit) / 100;
                    sectionsSize.push(size);
                }

                sectionLegends.push(element.legend);
                sectionColors.push(element.color);
            }

            configuration.sections.gaugeValues = gaugeValues;
            configuration.sections.sectionsSize = sectionsSize;
            configuration.sections.sectionsLegends = sectionLegends;
            configuration.sections.sectionsColors = sectionColors;

            powerGauge = gauge('#power-gauge', configuration);
            powerGauge.render();

            // every few seconds update reading values
            powerGauge.update(index);

            // setInterval(function () {
            //     updateReadings();
            // }, 1000 * 10);
        });
    }

    // function updateReadings() {
    //     d3.json(url, function(err, json) {
    //         const value = json.value;
    //         powerGauge.update(value);
    //     });
    // }

    start();
}

if (!window.isLoaded) {
    window.addEventListener("load", function () {
        onDocumentReady();
    }, false);
} else {
    onDocumentReady();
}