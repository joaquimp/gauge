function parametersTable(id, data) {
    var table = jQuery(id);

    if(table.length == 0) return;

    var html = '<table>'
        + '<thead>'
        + '<tr>'
        + '<th>1</th>'
        + '<th></th>'
        + '<th>2</th>'
        + '<th>3</th>'
        + '<th>5</th>'
        + '<th>4</th>'
        + '<th>5</th>'
        + '</tr>'
        + '<tr>'
        + '<th>Parâmetros</th>'
        + '<th>Pior</th>'
        + '<th>Melhor</th>'
        + '<th>Média ' + data.numberDaysAvarage  + ' dias</th>'
        + '<th>Nota</th>'
        + '<th>Peso</th>'
        + '<th>Nota Final</th>'
        + '</tr>'
        + '</thead>'
        + '<tbody>';
    
    //ICU
    html += '<tr>'
        + '<td>% ocupação de leitos de UTI</td>'
        + '<td>' + data.icuMax.toLocaleString() + '</td>'
        + '<td>' + data.icuMin.toLocaleString() + '</td>'
        + '<td>' + 65.29.toLocaleString() + '</td>'
        + '<td>' + 86.8.toLocaleString() + '</td>'
        + '<td>' + data.icuWeight.toLocaleString() + '</td>'
        + '<td>' + 8.7.toLocaleString() + '</td>'
        + '</tr>';

    //New Cases
    html += '<tr>'
        + '<td>Número de novos casos</td>'
        + '<td>' + data.newCasesMax.toLocaleString() + '</td>'
        + '<td>' + data.newCasesMin.toLocaleString() + '</td>'
        + '<td>' + 1632.18.toLocaleString() + '</td>'
        + '<td>' + 50.3.toLocaleString() + '</td>'
        + '<td>' + data.newCasesWeight.toLocaleString() + '</td>'
        + '<td>' + 20.1.toLocaleString() + '</td>'
        + '</tr>';

    //New Deaths
    html += '<tr>'
        + '<td>Número de novos óbitos</td>'
        + '<td>' + data.newDeathsMax.toLocaleString() + '</td>'
        + '<td>' + data.newDeathsMin.toLocaleString() + '</td>'
        + '<td>' + 176.22.toLocaleString() + '</td>'
        + '<td>' + 48.8.toLocaleString() + '</td>'
        + '<td>' + data.newDeathsWeight.toLocaleString() + '</td>'
        + '<td>' + 0.2.toLocaleString() + '</td>'
        + '</tr>';

    //Isolation Rate
    html += '<tr>'
        + '<td>% de isolamento</td>'
        + '<td>' + data.isolationRateMax.toLocaleString() + '</td>'
        + '<td>' + data.isolationRateMin.toLocaleString() + '</td>'
        + '<td>' + 49.50.toLocaleString() + '</td>'
        + '<td>' + 31.7.toLocaleString() + '</td>'
        + '<td>' + data.isolationRateWeight.toLocaleString() + '</td>'
        + '<td>' + 3.2.toLocaleString() + '</td>'
        + '</tr>';

    //R Value
    html += '<tr>'
        + '<td>Taxa de contágio R</td>'
        + '<td>' + data.rValueMax.toLocaleString() + '</td>'
        + '<td>' + data.rValueMin.toLocaleString() + '</td>'
        + '<td>' + 1.08.toLocaleString() + '</td>'
        + '<td>' + 76.9.toLocaleString() + '</td>'
        + '<td>' + data.rValueWeight.toLocaleString() + '</td>'
        + '<td>' + 15.4.toLocaleString() + '</td>'
        + '</tr>';

    
    html += '</tbody>'
         + '</table>';

    table.html(html);
}