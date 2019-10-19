/*////////////////////////////////////

Function to initailize CPA Diagram

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
        var array =[];

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
                // start = null;
            }
            
            if(j[i].End_Date === null){
                end = null;
            }else{
                end = new Date(moment(j[i].End_Date));
                // end = null;
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
