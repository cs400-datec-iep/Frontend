/*////////////////////////////////////

Function to initailize Pert Diagram

*/////////////////////////////////////
anychart.onDocumentReady(function () {
    //Urls
    var urlGetAllTasks = urlMain + 'api/GetTasksPerProject/'+sessionStorage.getItem('ProjectID');
    var data;
    var pert_array = new Array();
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

            for (var i = 0; i < j.length; i++) {
                if (j[i].PredecessorTaskID == 0) {
                    pert_array.push({
                        'id': '' + j[i].TaskID + '',
                        'duration': j[i].Number_of_days,
                        'name': '' + j[i].TaskID + '',
                        'fullName': j[i].Name,
                    })

                } else {
                    var array = ["" + j[i].PredecessorTaskID + ""];

                    pert_array.push({
                        'id': '' + j[i].TaskID + '',
                        'duration': j[i].Number_of_days,
                        'name': '' + j[i].TaskID + '',
                        'dependsOn': array,
                        'fullName': j[i].Name,
                    })

                }

            }

            // data
            data = pert_array;

            // set filling method for tree
            var treeData = anychart.data.tree(data, 'as-table');

            // create PERT chart
            var chart = anychart.pert();
            // set spacing between milestones
            chart.data(treeData)
                .horizontalSpacing('20%')
                // set padding for chart
                .padding([25, 50, 0, 50]);

            // get duration project
            var duration = chart.getStat('pertChartProjectDuration');

            // set title text
            chart.title()
                .enabled(true)
                .useHtml(true)
                .padding([0, 0, 35, 0])
                .text(
                    "PERT Diagram For " + result.Name +
                    "<br>" + "Project duration: " +
                    duration + ' days'
                );

            // set settings for tasks
            var tasks = chart.tasks();
            // format upper label task
            tasks.upperLabels().format(function () {
                return this.item.get('fullName');
            });

            // format lower label task
            tasks.lowerLabels().format('{%duration} days');

            // create tasks tooltip
            var taskTooltip = tasks.tooltip();
            // tooltip settings
            taskTooltip.separator(true)
                .titleFormat(function () {
                    // return fullName from data
                    return this.item.get('fullName');
                });
            taskTooltip.title().useHtml(true);

            // set settings for milestones
            var milestones = chart.milestones();
            // set milestones color
            milestones.color('#2C81D5')
                // set milestones item size
                .size('6.5%');
            milestones.hovered().fill(function () {
                return anychart.color.lighten(this.sourceColor, 0.25);
            });
            milestones.tooltip().format(defuaultMilesoneTooltipTextFormatter);

            // set settings for critical milestones
            var critMilestones = chart.criticalPath().milestones();
            // format label
            critMilestones.labels().format(function () {
                return this['creator'] ? this['creator'].get('name') : this['isStart'] ? 'Start' : 'Finish';
            });
            // set color
            critMilestones.color('#E24B26')
                // fill color for critMilestones item
                .fill(function () {
                    return this['creator'] ? this.sourceColor : this['isStart'] ? '#60727B' : '#60727B';
                });

            // hover fill/stroke color for critMilestones item
            critMilestones.hovered()
                .fill(function () {
                    return this['creator'] ? anychart.color.lighten(this.sourceColor, 0.25) : this['isStart'] ? '#60727b' : '#60727b';
                })
                .stroke(function () {
                    return this['creator'] ? '1.5 #a94e3d' : null;
                });

            // set container id for the chart
            chart.container('chart');
            // initiate chart drawing
            chart.draw();

            //Remove loading icon and display output
            document.getElementById("load").style.display = "none";
            document.getElementById("container_content").classList.remove("display-none");


            //Remove loading icon and display output for sidebar
            document.getElementById("icon_container").classList.remove("display-none");
            document.getElementById("sidebarToggle").classList.remove("display-none");

        }).catch(error => console.error('Error:', error));
});

function defuaultMilesoneTooltipTextFormatter() {
    var result = '';
    var i = 0;
    if (this['successors'] && this['successors'].length) {
        result += 'Successors:';
        for (i = 0; i < this['successors'].length; i++) {
            result += '\n - ' + this['successors'][i].get('fullName');
        }
        if (this['predecessors'] && this['predecessors'].length)
            result += '\n\n';
    }
    if (this['predecessors'] && this['predecessors'].length) {
        result += 'Predecessors:';
        for (i = 0; i < this['predecessors'].length; i++) {
            result += '\n - ' + this['predecessors'][i].get('fullName');
        }
    }
    return result;
}