
function gaugeChart(id, data) {
    // Default data
    var configuration = {
        size: 300,
        clipWidth: 302,
        clipHeight: 177,
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

    let index = data.results[0].value;
    let gaugeValues = [0];
    let sectionsSize = [];
    let sectionLegends = [];
    let sectionColors = [];

    for (var i = 0; i < data.fases.length; i++) {
        const element = data.fases[i];
        gaugeValues.push(element.limit);

        if (i == 0) {
            const size = element.limit / 100;
            sectionsSize.push(size);
        } else {
            const size = (element.limit - data.fases[i - 1].limit) / 100;
            sectionsSize.push(size);
        }

        sectionLegends.push(element.legend);
        sectionColors.push(element.color);
    }

    configuration.sections.gaugeValues = gaugeValues;
    configuration.sections.sectionsSize = sectionsSize;
    configuration.sections.sectionsLegends = sectionLegends;
    configuration.sections.sectionsColors = sectionColors;

    const powerGauge = gauge(id, configuration);
    powerGauge.render();

    // every few seconds update reading values
    powerGauge.update(index);
}