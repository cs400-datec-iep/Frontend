/*////////////////////////////////////

Function to initailize CPA Diagram

*/////////////////////////////////////
$(document).ready(function () {
    //Url
    var urlGetAllProjects = urlMain + 'api/Projects';

    //Fetch All Projects
    fetch(urlGetAllProjects, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
    .then(function (j) {

        //Variable decalration
        var chart_payload = [];
        chart_payload.push(['Project Name', 'Percentage Complete',]);

        var calendar_payload = [];


        //Set datasets
        j.forEach(element => {
            chart_payload.push([element.Name, element.Percentage]);
            calendar_payload.push([new Date (moment(element.Expected_Date)) , element.ProjectID, element.Name + " - " +moment(element.Expected_Date).format("MMM dddd, YYYY")]);

        });

        google.charts.load('current', {packages: ['corechart', 'bar']});
        google.charts.setOnLoadCallback(drawBasic);

        function drawBasic() {

            var data = google.visualization.arrayToDataTable(chart_payload);

            // set inner height to 30 pixels per row
            var chartAreaHeight = data.getNumberOfRows() * 30;
            // add padding to outer height to accomodate title, axis labels, etc
            var chartHeight = chartAreaHeight + 80;

            var options = {
                title: 'Project Percentage Complete',
                height: chartHeight,
                chartArea: {
                    width: '70%',
                    height: chartAreaHeight
                },
                hAxis: {
                title: 'Percentage Complete',
                minValue: 0
                },
                vAxis: {
                title: 'Project Name'
                }
            };

            var chart = new google.visualization.BarChart(document.getElementById('project_percentage_chart'));

            chart.draw(data, options);
        }

        google.charts.load("current", {packages:["calendar"]});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn({ type: 'date', id: 'Date' });
            dataTable.addColumn({ type: 'number', id: 'Id' });
            dataTable.addColumn({type: 'string', role: 'tooltip'});
            dataTable.addRows(calendar_payload);

            var chart = new google.visualization.Calendar(document.getElementById('project_calender_chart'));

            // set inner height to 30 pixels per row
            var chartAreaHeight = dataTable.getNumberOfRows() * 30;
            // add padding to outer height to accomodate title, axis labels, etc
            var chartHeight = chartAreaHeight + 80;

            var options = {
                title: "Today: " + moment().format("MMM DD, YYYY"),
                height: chartHeight,
                chartArea: {
                    width: '100%',
                    height: chartAreaHeight
                },
                tooltip: {isHtml: true}
            };

            chart.draw(dataTable, options);
        }

    }).catch(error => console.error('Error:', error));



})