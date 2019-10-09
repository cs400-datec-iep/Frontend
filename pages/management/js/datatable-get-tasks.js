/*////////////////////////////////////

Display tasks in datatable

*/////////////////////////////////////
$(document).ready(function () {
    //Get ID from url
    var url = window.location.href;
    var projectID = url.substring(url.lastIndexOf('?') + 1);

    //Urls
    var urlGetTask = urlMain + "api/GetTasksPerProject/" + projectID;
    var urlGetUserMains = urlMain + "api/UserMains";

    var dataset = [];

    // Get user names to compare with userdID in task
    fetch(urlGetUserMains, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(result => result.json())
    .then((users) => {
        //Get All tasks for list view
        fetch(urlGetTask, {
            async: false,
            method: 'GET',
            crossDomain: true,
            headers: {
            'Authorization': 'Bearer ' + token
            }
        }).then(response => response.json())
        .then((tasks) => {

            //loop through tasks and user to match matching UserID's
            tasks.forEach(element => {
                users.forEach(user => {

                    if(element.UserID === user.ID){

                        //Parsing date into correct format
                        if(element.Start_Date == null){
                            var datestart = "Has not started work";
                        }else{
                            var datestart = new Date(element.Start_Date);
                            datestart = moment(datestart).format('DD-MMM-YYYY');
                        }

                        var datecreated = new Date(element.Date_Created);
                        datecreated = moment(datecreated).format('DD-MMM-YYYY');
                        
                        // Check task type (Prepare array for datatable)
                        if (element.If_Milestone === false && element.If_Objective === false) {
                
                            var dataObj = {
                            "TaskID" : element.TaskID,
                            "Type" : "Task",
                            "Name" : element.Name,
                            "Created_Date": datecreated,
                            "Start_Date" : datestart,
                            "Status" : element.Progress_Status,
                            "Duration" : element.Number_of_days +" Days",
                            "Assigned_To" : user.Username
                            };
                
                            dataset.push(dataObj);
                
                        } else if (element.If_Objective === true && element.If_Milestone === false) {
                
                            var dataObj = {
                            "TaskID" : element.TaskID,
                            "Type" :"Objective",
                            "Name" : element.Name,
                            "Created_Date": datecreated,
                            "Start_Date" : datestart,
                            "Status" : element.Progress_Status,
                            "Duration" : element.Number_of_days +" Days",
                            "Assigned_To" : user.Username
                            };
                
                            dataset.push(dataObj);
                
                        } else if (element.If_Milestone === true && element.If_Objective === false) {
                
                            var dataObj = {
                            "TaskID" : element.TaskID,
                            "Type" :"Milestone",
                            "Name" : element.Name,
                            "Created_Date": datecreated,
                            "Start_Date" : datestart,
                            "Status" : element.Progress_Status,
                            "Duration" : element.Number_of_days +" Days",
                            "Assigned_To" : user.Username
                            };
                
                            dataset.push(dataObj);
                
                        }
                    }
                });
            });
    
            //Initialize datatable
            table = $('#taskTable').DataTable(
            {
                data: dataset,
                select: true,
                columns: [
                { data: 'TaskID' },
                { data: 'Type' },
                { data: 'Name' },
                { data: 'Created_Date' },
                { data: 'Start_Date' },
                { data: 'Status' },
                { data: 'Duration' },
                { data: 'Assigned_To' }
                ]
            });

            //Allow view tasks if records > 0
            var records = totalDisplayRecord = $("#taskTable").DataTable().page.info().recordsDisplay;

            if(records > 0){
                

                //View task details
                $('#taskTable tbody').on( 'click', 'tr', function () {
    
                    //Create a button to open modal cause frankly modal.('show') doesnt work
                    var btn = document.createElement("button");
                    btn.id = "click";
                    btn.setAttribute("data-toggle","modal");
                    btn.setAttribute("data-target","#taskViewListModal");
                    btn.setAttribute("hidden","true");
                    document.getElementById("container").appendChild(btn);
                    $('#click').trigger('click');
    
                    //Load data into modal
                    tasks.forEach(value => {
                        if(value.TaskID == table.row(this).data().TaskID){
                            document.getElementById("taskNameList").innerHTML = value.Name;
                            document.getElementById("taskStatusList").innerHTML = value.Progress_Status;
                            document.getElementById("valueList").innerHTML = value.Percentage+"%";
                            document.getElementById("percentageRangeList").setAttribute("Style","width:"+value.Percentage+"%;")
                            document.getElementById("taskPredList").innerHTML = value.PredecessorTaskID;
                            document.getElementById("taskDurationList").innerHTML = value.Number_of_days;
                            document.getElementById("taskDescList").innerHTML = value.Description;
                        }
                    })
    
                });
            }else{
                document.getElementById("taskTableContainer").classList.toggle("d-none");
                document.getElementById("no_tasksTable").classList.toggle("d-none");

            }

        }).catch(error => { console.error('Error:', error); return error; });
    }).catch(error => { console.error('Error:', error); return error; });



});