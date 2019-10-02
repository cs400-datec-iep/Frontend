/*////////////////////////////////////

Function to Display project details

*/////////////////////////////////////
$(document).ready(function () {
    //Get ID from url
    var url = window.location.href;
    var projectID = url.substring(url.lastIndexOf('?') + 1);

    //Urls
    var urlGetProjectByID = urlMain+'api/Projects/'+projectID;
    var urlGetTasksByUserANdProject = urlMain+'api/GetTasksPerProjectsAndUser/'+projectID+"/";
    var urlGetTask = urlMain + "api/GetTasksPerProject/" + projectID;
    var urlGetUserMains = urlMain + "api/UserMains";

    //Dataset array for table
    var dataset = [];

    //Get project details
    fetch(urlGetProjectByID, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
    .then(function (j) {

        //Message for no Projects to Display
        if(j.length == 0){
            document.getElementById("no_project").style.display = "inline-block";
        }

        //Get html Containers
        var page_title =  document.getElementById("page_title");
        var project_name =  document.getElementById("project_name_title");
        var project_name_side =  document.getElementById("project_name_side");
        var project_name_crumb =  document.getElementById("project_name_crumb");
        var project_client =  document.getElementById("project_client");
        var project_status  =  document.getElementById("project_status");
        var startDate =  document.getElementById("project_startDate");
        var endDate =  document.getElementById("project_endDate");
        var project_percentage =  document.getElementById("project_percentage_text");
        var progress_meter  =  document.getElementById("progress_meter");
        var project_duration  =  document.getElementById("project_duration");

        
        //Get dates only
        var start = j.Start_Date; 
        var end = j.End_Date;
        
        var datestart ="";
        var dateend ="";

        //Get start date
        for (var i = 0; i < start.length; i++) {
            if(start.charAt(i) == "T"){
                break;
            }
            datestart += start.charAt(i);
        }

        //Get end date
        for (var i = 0; i < end.length; i++) {
            if(end.charAt(i) == "T"){
                break;
            }
            dateend += end.charAt(i);
        }

        // Parsing date in dd/mm/yyyyy
        var datestart = new Date(datestart);
        var dateend = new Date(dateend);

        startDate.innerHTML = moment(datestart).format('DD-MMM-YYYY');
        endDate.innerHTML =   moment(dateend).format('DD-MMM-YYYY');
        project_duration.innerHTML = j.number_of_days;

        //Display critical status
        var critical = document.createElement("p");
        critical.classList.add('text-center','text-danger');
        critical.innerHTML = "! CRITICAL !"
        
        // Set session var for project name and project ID
        sessionStorage.setItem('ProjectName',j.Name);
        sessionStorage.setItem('ProjectID',j.ProjectID);

        //Appending data onto the html containers
        page_title.innerHTML = j.Name;
        project_name.innerHTML = j.Name;
        project_name_side.innerHTML = j.Name;
        project_name_crumb.innerHTML = j.Name;
        project_client.innerHTML = j.Client_Name;

        progress_meter.setAttribute("Style","width:"+j.Percentage+"%;")
        project_percentage.innerHTML = j.Percentage+"%";

        // Check critical project
        if(j.Critical_flag == true){
            //Diplsay Critial Status
            var icon = document.createElement("i");
            icon.classList.add('fas', 'fa-info-circle','text-red','ml-1');
            project_status.classList.add('text-danger','font-weight-bold','text-blink');
            project_status.innerHTML = "CRITICAL";
            project_status.appendChild(icon);
        }else{
            // Check Project status and display
            if(j.Progress_Status == "OnGoing"){
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-chevron-circle-right','text-blue','ml-1');
                project_status.innerHTML = "On Going";
                project_status.appendChild(icon);

            }else if(j.Progress_Status == "OnHold"){
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-pause-circle','text-yellow','ml-1');
                project_status.innerHTML = "On Hold";
                project_status.appendChild(icon);

            }else if(j.Progress_Status == "Completed"){
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-check-circle','text-green','ml-1');
                project_status.innerHTML = "Completed";
                project_status.appendChild(icon);

            }else if(j.Progress_Status == "Cancelled"){
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-times-circle','text-red','ml-1');
                project_status.innerHTML = "Cancelled";
                project_status.appendChild(icon);
            }
        }

        //Get user tasks for grid view
        fetch(urlGetTasksByUserANdProject + sessionStorage.getItem("userID"), {
            async: false,
            method: 'GET',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function (c) { return c.json() })
        .then(function (b) {

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

                    //Display tasks in boards
                    var cointaner_todo = document.getElementById("todo");
                    var cointaner_doing = document.getElementById("doing");
                    var cointaner_done = document.getElementById("done");
                    
                    b.forEach(element => {
                        if(element.Progress_Status === "Todo" && element.If_Milestone == false && element.If_Objective == false){
                            
                            tasks.forEach(task_element => {
                                if(element.PredecessorTaskID == task_element.TaskID && !(task_element.Progress_Status == "Done")){

                                    var card = document.createElement("button");
                                    card.classList.add("border-left-warning","mb-2");
                                    card.id = "Locked";
                
                                    var taskTitle =  document.createElement("p");
                                    taskTitle.classList.add("text-lg");
                                    taskTitle.innerHTML = element.TaskID+" "+element.Name;
                
                                    var tasksStartDate = document.createElement("p");
                                    tasksStartDate.classList.add("text-sm");
                                    var datetask = new Date(element.Start_Date);
                                    tasksStartDate.innerHTML = "Created: "+moment(datetask).format('DD-MMM-YYYY') + " (Duration: "+element.Number_of_days+" days)";
                
                                    card.appendChild(taskTitle);
                                    card.appendChild(tasksStartDate);
                                    cointaner_todo.appendChild(card);
                                }

                            })
                        
                        } else if(element.Progress_Status  === "Doing" && element.If_Milestone == false && element.If_Objective == false){

                            var card = document.createElement("div");
                            card.classList.add("drag-item" ,"border-left-danger","mb-2");
                            card.id = element.TaskID;
                            card.setAttribute("data-toggle","modal");
                            card.setAttribute("data-target","#taskViewModal");
                            card.onclick = function (){

                                document.getElementById("taskName").innerHTML = element.Name;
                                document.getElementById("taskStatus").innerHTML = element.Progress_Status;
                                document.getElementById("value").innerHTML = element.Percentage+"%";
                                document.getElementById("percentageRange").value = element.Percentage;
                                document.getElementById("taskPred").innerHTML = element.PredecessorTaskID;
                                document.getElementById("taskDuration").innerHTML = element.Number_of_days;
                                document.getElementById("taskDesc").innerHTML = element.Description;
                                document.getElementById("grid_edit").classList.add('d-none');
                                sessionStorage.setItem("taskIdKanbanClicked",element.TaskID);

                            }

                            var taskTitle =  document.createElement("p");
                            taskTitle.classList.add("text-lg");
                            taskTitle.innerHTML = element.TaskID+" "+element.Name;

                            var tasksStartDate = document.createElement("p");
                            tasksStartDate.classList.add("text-sm");
                            var datetask = new Date(element.Start_Date);
                            tasksStartDate.innerHTML = "Created: "+moment(datetask).format('DD-MMM-YYYY') + " (Duration: "+element.Number_of_days+" days)";

                            card.appendChild(taskTitle);
                            card.appendChild(tasksStartDate);
                            cointaner_doing.appendChild(card);

                        } else if(element.Progress_Status === "Done" && element.If_Milestone == false && element.If_Objective == false){

                            var card = document.createElement("div");
                            card.classList.add("drag-item" ,"border-left-success","mb-2");
                            card.id = element.TaskID;

                            var taskTitle =  document.createElement("p");
                            taskTitle.classList.add("text-lg");
                            taskTitle.innerHTML = element.TaskID+" "+element.Name;

                            var tasksStartDate = document.createElement("p");
                            tasksStartDate.classList.add("text-sm");
                            var datetask = new Date(element.Start_Date);
                            tasksStartDate.innerHTML = "Created: "+moment(datetask).format('DD-MMM-YYYY') + " (Duration: "+element.Number_of_days+" days)";

                            card.appendChild(taskTitle);
                            card.appendChild(tasksStartDate);
                            cointaner_done.appendChild(card);

                        }
                    });
                    
                    //loop through tasks and user to match matching UserID's
                    tasks.forEach(element => {
                        users.forEach(user => {

                            if(element.UserID === user.ID){

                                //Parsing date into correct format
                                var datestart = new Date(element.Start_Date);
                                datestart = moment(datestart).format('DD-MMM-YYYY');
                        
                                //Populate task predecessor
                                $('#taskPredecesor').append($('<option>', {
                                    value: element.TaskID,
                                    text: element.Name,
                                }));

                                
                                // Check task type (Prepare array for datatable)
                                if (element.If_Milestone === false && element.If_Objective === false) {
                        
                                    var dataObj = {
                                    "TaskID" : element.TaskID,
                                    "Type" : "Task",
                                    "Name" : element.Name,
                                    "Start_Date" : datestart,
                                    "Status" : element.Progress_Status,
                                    "Duration" : element.Number_of_days,
                                    "Assigned_To" : user.Username
                                    };
                        
                                    dataset.push(dataObj);
                        
                                } else if (element.If_Objective === true && element.If_Milestone === false) {
                        
                                    var dataObj = {
                                    "TaskID" : element.TaskID,
                                    "Type" :"Objective",
                                    "Name" : element.Name,
                                    "Start_Date" : datestart,
                                    "Status" : element.Progress_Status,
                                    "Duration" : element.Number_of_days,
                                    "Assigned_To" : user.Username
                                    };
                        
                                    dataset.push(dataObj);
                        
                                } else if (element.If_Milestone === true && element.If_Objective === false) {
                        
                                    var dataObj = {
                                    "TaskID" : element.TaskID,
                                    "Type" :"Milestone",
                                    "Name" : element.Name,
                                    "Start_Date" : datestart,
                                    "Status" : element.Progress_Status,
                                    "Duration" : element.Number_of_days,
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
                        { data: 'Start_Date' },
                        { data: 'Status' },
                        { data: 'Duration' },
                        { data: 'Assigned_To' }
                        ]
                    });
            
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

                
                    //Remove loading icon on success
                    document.getElementById("load").style.display = "none";

                    //Remove loading icon and display output for sidebar
                    document.getElementById("icon_container").classList.remove("display-none");
                    document.getElementById("sidebarToggle").classList.remove("display-none");

                    //Return Container to display normal output
                    document.getElementById("container").classList.remove("display-none");
            
                }).catch(error => { console.error('Error:', error); return error; });

            }).catch(error => { console.error('Error:', error); return error; });

        }).catch(error => console.error('Error:', error));

    }).catch(error => { console.error('Error:', error); return error; });
});

