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
        chart_payload.push(['Project Name', 'Work Done','Expected Work']);

        var calendar_payload = [];


        //Set datasets
        j.forEach(element => {
            var exp_date = moment(element.Start_Date);
            var date_now = moment(new Date());
            var diff = date_now.diff(exp_date, 'days');
            var percentage = (diff/element.number_of_days)*100;

            console.log(element.Name +": "+percentage);

            chart_payload.push([element.Name, element.Percentage,percentage]);

            if(element.Critical_flag == true){
                calendar_payload.push([new Date (moment(element.Expected_Date)) , -50, element.Name + " - " +moment(element.Expected_Date).format("MMM dddd, YYYY")]);
            }else{
                calendar_payload.push([new Date (moment(element.Expected_Date)) , element.ProjectID, element.Name + " - " +moment(element.Expected_Date).format("MMM dddd, YYYY")]);
            }

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
                noDataPattern: {
                    backgroundColor: '#858796'
                },
                calendar: {
                    monthOutlineColor: {
                        stroke: '#243568',
                        strokeOpacity: 0.8,
                        strokeWidth: 2
                    },
                    unusedMonthOutlineColor: {
                        stroke: '#5a5c69',
                        strokeOpacity: 0.8,
                        strokeWidth: 1
                    },
                },
                colorAxis: {colors:['red','#4e73df','#4e73df']},
                tooltip: {isHtml: false}
            };
            google.visualization.events.addListener(chart, 'ready', function () {
                $($('#project_calender_chart text')[0]).text('Critical');
                $($('#project_calender_chart text')[1]).text('');
                $($('#project_calender_chart text')[2]).text('Not Critical');
              });
            chart.draw(dataTable, options);
        }

    }).catch(error => console.error('Error:', error));



})