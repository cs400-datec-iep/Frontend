/*////////////////////////////////////

Function to initailize Project Smart Reporting

*/////////////////////////////////////
$(document).ready(function () {
    //Urls
    var urlGetAllTasks = urlMain + 'api/GetTasksPerProject/'+sessionStorage.getItem('ProjectID');
    var result = JSON.parse(sessionStorage.getItem('ProjectDetails'));

    //Fetch all project tasks
    fetch(urlGetAllTasks, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
        .then(function (j) {

        //Check if no data
        if(j.length == 0){
            document.getElementById("gantt-no-data").classList.toggle("d-none");
            document.getElementById("chart_div").classList.toggle("d-none");
            document.getElementById("status-no-data").classList.toggle("d-none");
            document.getElementById("task_complete_chart").classList.toggle("d-none");
            document.getElementById("active-no-data").classList.toggle("d-none");
            document.getElementById("task_active_inactive_chart").classList.toggle("d-none");
            document.getElementById("percentage-no-data").classList.toggle("d-none");
            document.getElementById("task_percentage_chart").classList.toggle("d-none");
        }

        //Variable decalrations
        var chart_payload = [];
        chart_payload.push(['Task Name', 'Work Done','Expected Work']);
        var num_todo = 0, num_doing = 0, num_done = 0;
        var active_tasks = 0, inactive_tasks = 0;
        var array =[];

        //Set datasets
        j.forEach(element => {
            //Expected work vs work done calculation
            if(element.Start_Date == null){
                var percentage = 0;
            }else{
                var start_date = moment(element.Start_Date);
                var date_now = moment(new Date());
                var diff = date_now.diff(start_date, 'days');
                var percentage = (diff/element.Number_of_days)*100;
            }

            //Percentage completions per Task
            chart_payload.push([element.Name, element.Percentage, percentage]);

            //Projects comeplted
            if(element.Progress_Status === "Todo"){
                num_todo++
            }else if(element.Progress_Status === "Doing"){
                num_doing++;
            }else if(element.Progress_Status === "Done"){
                num_done++;
            }


            //Active vs inactive projects
            if(element.Status === true){
                active_tasks++;
            }else if(element.Status === false){
                inactive_tasks++;
            }
            
        });

        //CPA Chart
        google.charts.load('current', {'packages':['gantt']});
        google.charts.setOnLoadCallback(drawChart);

        function daysToMilliseconds(days) {
            return days * 24 * 60 * 60 * 1000;
        }

        function drawChart() {

                var data = new google.visualization.DataTable();
                var start, end;
                data.addColumn('string', 'Task ID');
                data.addColumn('string', 'Task Name');
                data.addColumn('date', 'Start Date');
                data.addColumn('date', 'End Date');
                data.addColumn('number', 'Duration');
                data.addColumn('number', 'Percent Complete');
                data.addColumn('string', 'Dependencies');
            

                for (var i = 0; i < j.length; i++) {

                    if(j[i].Start_Date === null){
                        start = null;
                    }else{
                        start = new Date(moment(j[i].Start_Date));
                    }
                    
                    if(j[i].End_Date === null){
                        end = null;
                    }else{
                        end = new Date(moment(j[i].End_Date));
                    }

                    if (j[i].PredecessorTaskID == 0 ) {

                        array.push([
                            String(j[i].TaskID), 
                            j[i].Name,                  
                            start,
                            end,
                            daysToMilliseconds(j[i].Number_of_days),
                            j[i].Percentage,
                            null
                        ]);

                    } else {
                        array.push([
                            String(j[i].TaskID),
                            j[i].Name,                   
                            start,
                            end,
                            daysToMilliseconds(j[i].Number_of_days),
                            j[i].Percentage,
                            String(j[i].PredecessorTaskID)
                        ]);

                    }

                }

            data.addRows(array);
            var rowHieght = 41;
            var padding = 9;
            var total = rowHieght + padding

            var options = {
                height: data.getNumberOfRows() * total,
                gantt:{
                    criticalPathEnabled: true,
                    criticalPathStyle: {
                    stroke: '#e64a19',
                    strokeWidth: 5
                    },
                    labelStyle: {
                        color: '#ff0000',
                        fontName: 'sans-serif',
                        fontSize: 15
                    },
                    palette: [
                        {
                            "color": "#4e73df",
                            "dark": "#1cc88a",
                            "light": "#8b9fdb"
                        },
                    ]
                }
            };

            var chart = new google.visualization.Gantt(document.getElementById('chart_div'));
            chart.draw(data, options);
        }

        //Task percentage compeleted Chart
        google.charts.load('current', {'packages':['bar']});
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
                    height: chartAreaHeight
                },
                bars: 'horizontal',
                hAxis: {
                    title: 'Percentage Complete (%)',
                    minValue: 0
                },
                vAxis: {
                title: 'Project Name'
                }
            };
            
            var chart = new google.charts.Bar(document.getElementById('task_percentage_chart'));

            chart.draw(data, google.charts.Bar.convertOptions(options));
        }

        //Tasks Status pie chart
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawPie);
        function drawPie() {
            var data = google.visualization.arrayToDataTable([
            ['Status', 'Number'],
            ['Tasks Todo',     num_todo],
            ['Tasks Being Done',      num_doing],
            ['Tasks Completed',  num_done]
            ]);

            var options = {
                is3D:true,
                chartArea: {
                    width: '90%',
                    height: '90%'
                },
            };

            var chart = new google.visualization.PieChart(document.getElementById('task_complete_chart'));

            chart.draw(data, options);
        }

        //Doughtnut chart Task active vs not-active
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(drawDoughnut);
        function drawDoughnut() {
            var data = google.visualization.arrayToDataTable([
            ['Status', 'Number'],
            ['Active Tasks',     active_tasks],
            ['Inactive Tasks',      inactive_tasks]
            ]);

            var options = {
                pieHole: 0.4,
                chartArea: {
                    width: '90%',
                    height: '90%'
                },
            };

            var chart = new google.visualization.PieChart(document.getElementById('task_active_inactive_chart'));
            chart.draw(data, options);
        }

        $(window).resize(function(){
            drawBasic();
            drawPie();
            drawDoughnut();
        });

        //Addnames on sidebar and breadcrumb
        document.getElementById("project_name_side").innerHTML = result.Name;
        document.getElementById("project_link").href = "view_project.html?"+sessionStorage.getItem('ProjectID');
        document.getElementById("project_name_crumb").innerHTML = result.Name;

        //Remove loading icon and display output
        document.getElementById("load").style.display = "none";
        document.getElementById("container_content").classList.remove("display-none");


        //Remove loading icon and display output for sidebar
        document.getElementById("icon_container").classList.remove("display-none");
        document.getElementById("sidebarToggle").classList.remove("display-none");

    }).catch(error => console.error('Error:', error));
});
