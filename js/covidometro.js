
function onDocumentReady() {

    const url = "data.json";

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
            const value = json.value;
            let gaugeValues = json.fases.values;
            const sectionsSize = gaugeValues.map(function (num) { return num / 100; })
            const sectionLegends = json.fases.names;
            const sectionColors = json.fases.colors;

            // Adjusting values
            gaugeValues.unshift(0);
            for (let i = 1; i < gaugeValues.length; i++) {
                gaugeValues[i] = gaugeValues[i - 1] + gaugeValues[i];
            }

            configuration.sections.gaugeValues = gaugeValues;
            configuration.sections.sectionsSize = sectionsSize;
            configuration.sections.sectionsLegends = sectionLegends;
            configuration.sections.sectionsColors = sectionColors;

            console.log(configuration);

            powerGauge = gauge('#power-gauge', configuration);
            powerGauge.render();

            // every few seconds update reading values
            powerGauge.update(value);

            setInterval(function () {
                updateReadings();
            }, 1000 * 10);
        });
    }

    function updateReadings() {
        d3.json(url, function(err, json) {
            const value = json.value;
            powerGauge.update(value);
        });
    }

    start();
}

if (!window.isLoaded) {
    window.addEventListener("load", function () {
        onDocumentReady();
    }, false);
} else {
    onDocumentReady();
}