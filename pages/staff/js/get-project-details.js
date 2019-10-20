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
    var UpdateProjectPercentage = urlMain + 'api/UpdateProjectPercentage/'+projectID+'/';

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
        var expDate =  document.getElementById("project_expDate");
        var project_percentage =  document.getElementById("project_percentage_text");
        var progress_meter  =  document.getElementById("progress_meter");
        var project_duration  =  document.getElementById("project_duration");

        //Set up dates
        expDate.innerHTML =  moment(j.Expected_Date).format('DD-MMM-YYYY');
        startDate.innerHTML = moment(j.Start_Date).format('DD-MMM-YYYY');

        if(j.endDate === null){
            endDate.innerHTML = "Not Completed";
        }else{
            endDate.innerHTML =  moment(j.endDate).format('DD-MMM-YYYY');
        }

        project_duration.innerHTML = j.number_of_days+" Days";

        //Display critical status
        var critical = document.createElement("p");
        critical.classList.add('text-center','text-danger');
        critical.innerHTML = "! CRITICAL !"
        
        //Set session var for project name and project ID
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

        //Check critical project
        if(j.Critical_flag == true){ //Display Critial Status
            var icon = document.createElement("i");
            icon.classList.add('fas', 'fa-info-circle','text-red','ml-1');
            project_status.classList.add('text-danger','font-weight-bold','text-blink');
            project_status.innerHTML = "CRITICAL";
            project_status.appendChild(icon);
        }else{//Check Project status and display
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

                //Get html container
                var pm = document.getElementById("project_manager");

                //Loop thorugh array of users and append them to the project manager container
                for(var i = 0; i< users.length; i++){
                    if(j.Project_managerID === users[i].ID){
                        pm.innerHTML = users[i].Username;
                    }
                }

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

                    //Get board containers
                    var cointaner_todo = document.getElementById("todo");
                    var cointaner_doing = document.getElementById("doing");
                    var cointaner_done = document.getElementById("done");
                    
                    //Display tasks in kanban boards
                    b.forEach(element => {

                        if(element.Progress_Status === "Todo" && element.PredecessorTaskID != 0){
                            
                            //Checks if predecesor tasks are compelte   
                            tasks.forEach(task => {
                                if(element.PredecessorTaskID == task.TaskID ){
                                    if(task.Progress_Status == "Done" ){
                                        var card = document.createElement("div");
                                        card.classList.add("drag-item","border-left-warning","mb-2","col-md-11");
                                        card.id =  element.TaskID;
                                        card.setAttribute("data-toggle","modal");
                                        card.setAttribute("data-target","#taskViewModal");
                                        card.onclick = function (){

                                            document.getElementById("taskName").innerHTML = element.Name;
                                            document.getElementById("taskStatus").innerHTML = element.Progress_Status;
                                            document.getElementById("percentage_container").classList.add('d-none');
                                            document.getElementById("taskPred").innerHTML = element.PredecessorTaskID;
                                            document.getElementById("taskDuration").innerHTML = element.Number_of_days + " Days";
                                            document.getElementById("taskDesc").innerHTML = element.Description;
                                            document.getElementById("grid_footer").classList.add('d-none');

                                        }
                    
                                        var taskTitle =  document.createElement("p");
                                        taskTitle.classList.add("text-lg","text-center");
                                        taskTitle.innerHTML = element.TaskID+" "+element.Name;
                    
                                        var taskCreatedDate = document.createElement("p");
                                        taskCreatedDate.classList.add("text-sm");
                                        var datetask = new Date(element.Date_Created);
                                        taskCreatedDate.innerHTML = "Created: "+moment(datetask).format('DD-MMM-YYYY') + " (Duration: "+element.Number_of_days+" days)";
                    
                                        card.appendChild(taskTitle);
                                        card.appendChild(taskCreatedDate);
                                        cointaner_todo.appendChild(card);

                                    }else{
                                        var card = document.createElement("div");
                                        card.classList.add("drag-item","item-danger","mb-2","col-md-11");
                                        card.id =  "Locked";
                                        card.setAttribute("data-toggle","modal");
                                        card.setAttribute("data-target","#taskViewModal");
                                        card.onclick = function (){

                                            document.getElementById("taskName").innerHTML = element.Name;
                                            document.getElementById("taskStatus").innerHTML = element.Progress_Status;
                                            document.getElementById("percentage_container").classList.add('d-none');
                                            document.getElementById("taskPred").innerHTML = element.PredecessorTaskID + " (TASK NOT COMPLETED)";
                                            document.getElementById("taskDuration").innerHTML = element.Number_of_days + " Days";
                                            document.getElementById("taskDesc").innerHTML = element.Description;
                                            document.getElementById("grid_footer").classList.add('d-none');

                                        }
                    
                                        var taskTitle =  document.createElement("p");
                                        taskTitle.classList.add("text-lg","text-center","mb-0");
                                        taskTitle.innerHTML = element.TaskID+" "+element.Name;
                    
                                        var taskSubTitle =  document.createElement("p");
                                        taskSubTitle.classList.add("text-white","text-center","mt-2","mb-2","p-0","font-weight-bold","text-lg","text-underline");
                                        taskSubTitle.innerHTML = "PREDECESSOR TASK NOT COMPLETED ID: "+element.PredecessorTaskID;
                    
                                        var taskCreatedDate = document.createElement("p");
                                        taskCreatedDate.classList.add("text-sm");
                                        var datetask = new Date(element.Date_Created);
                                        taskCreatedDate.innerHTML = "Created: "+moment(datetask).format('DD-MMM-YYYY') + " (Duration: "+element.Number_of_days+" days)";
                    
                                        card.appendChild(taskTitle);
                                        card.appendChild(taskSubTitle);
                                        card.appendChild(taskCreatedDate);
                                        cointaner_todo.appendChild(card);
                                    }
                                }
                                
                            });

                        }else if(element.Progress_Status === "Todo"){
                            
                            var card = document.createElement("div");
                            card.classList.add("drag-item","border-left-warning","mb-2" ,"col-md-11");
                            card.id =  element.TaskID;
                            card.setAttribute("data-toggle","modal");
                            card.setAttribute("data-target","#taskViewModal");
                            card.onclick = function (){

                                document.getElementById("taskName").innerHTML = element.Name;
                                document.getElementById("taskStatus").innerHTML = element.Progress_Status;
                                document.getElementById("percentage_container").classList.add('d-none');
                                document.getElementById("taskPred").innerHTML = element.PredecessorTaskID;
                                document.getElementById("taskDuration").innerHTML = element.Number_of_days + " Days";
                                document.getElementById("taskDesc").innerHTML = element.Description;
                                document.getElementById("grid_footer").classList.add('d-none');

                            }
        
                            var taskTitle =  document.createElement("p");
                            taskTitle.classList.add("text-lg","text-center");
                            taskTitle.innerHTML = element.TaskID+" "+element.Name;
        
                            var taskCreatedDate = document.createElement("p");
                            taskCreatedDate.classList.add("text-sm");
                            var datetask = new Date(element.Date_Created);
                            taskCreatedDate.innerHTML = "Created: "+moment(datetask).format('DD-MMM-YYYY') + " (Duration: "+element.Number_of_days+" days)";
        
                            card.appendChild(taskTitle);
                            card.appendChild(taskCreatedDate);
                            cointaner_todo.appendChild(card);
                        
                        } else if(element.Progress_Status  === "Doing"){
                            var card = document.createElement("div");
                            card.classList.add("drag-item" ,"border-left-danger","mb-2");
                            card.id = element.TaskID;
                            card.setAttribute("data-toggle","modal");
                            card.setAttribute("data-target","#taskViewModal");
                            card.onclick = function (){

                                document.getElementById("taskName").innerHTML = element.Name;
                                document.getElementById("taskStatus").innerHTML = element.Progress_Status;
                                document.getElementById("percentage_container").classList.remove('d-none');
                                document.getElementById("value").innerHTML = element.Percentage+"%";
                                document.getElementById("percentageRange").value = element.Percentage;
                                document.getElementById("taskPred").innerHTML = element.PredecessorTaskID;
                                document.getElementById("taskDuration").innerHTML = element.Number_of_days + " Days";
                                document.getElementById("taskDesc").innerHTML = element.Description;
                                document.getElementById("grid_footer").classList.add('d-none');
                                sessionStorage.setItem("taskIdKanbanClicked",element.TaskID);

                            }

                            var taskTitle =  document.createElement("p");
                            taskTitle.classList.add("text-lg","text-center");
                            taskTitle.innerHTML = element.TaskID+" "+element.Name;
        
                            var taskCreatedDate = document.createElement("p");
                            taskCreatedDate.classList.add("text-sm");
                            var datetask = new Date(element.Date_Created);
                            taskCreatedDate.innerHTML = "Created: "+moment(datetask).format('DD-MMM-YYYY') + " (Duration: "+element.Number_of_days+" days)";
        
                            card.appendChild(taskTitle);
                            card.appendChild(taskCreatedDate);
                            cointaner_doing.appendChild(card);

                        } else if(element.Progress_Status === "Done"){

                            var card = document.createElement("div");
                            card.classList.add("drag-item" ,"border-left-success","mb-2");
                            card.id = element.TaskID;
                            card.setAttribute("data-toggle","modal");
                            card.setAttribute("data-target","#taskViewModal");
                            card.onclick = function (){

                                document.getElementById("taskName").innerHTML = element.Name;
                                document.getElementById("taskStatus").innerHTML = element.Progress_Status;
                                document.getElementById("percentage_container").classList.add('d-none');
                                document.getElementById("taskPred").innerHTML = element.PredecessorTaskID;
                                document.getElementById("taskDuration").innerHTML = element.Number_of_days + " Days";
                                document.getElementById("taskDesc").innerHTML = element.Description;
                                document.getElementById("grid_footer").classList.add('d-none');

                            }

                            var taskTitle =  document.createElement("p");
                            taskTitle.classList.add("text-lg","text-center");
                            taskTitle.innerHTML = element.TaskID+" "+element.Name;

                            var taskCreatedDate = document.createElement("p");
                            taskCreatedDate.classList.add("text-sm");
                            var datetask = new Date(element.Date_Created);
                            taskCreatedDate.innerHTML = "Created: "+moment(datetask).format('DD-MMM-YYYY') + " (Duration: "+element.Number_of_days+" days)";

                            card.appendChild(taskTitle);
                            card.appendChild(taskCreatedDate);
                            cointaner_done.appendChild(card);

                        }
                    });

                    //Updates percentage of project via task calculation
                    var total_tasks = tasks.length;
                    var total_percentage, counter = 0;

                    tasks.forEach(element => {
                        if(element.Progress_Status == "Done"){
                            counter++;
                        }
                    })
                    
                    total_percentage = (counter/total_tasks)* 100;

                    //Update project percentage
                    fetch(UpdateProjectPercentage + total_percentage, {
                        async: false,
                        method: 'POST',
                        crossDomain: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        }
                    }).catch(error => { console.error('Error:', error); return error; });
                    
                    //loop through tasks and user to match matching UserID's
                    tasks.forEach(element => {
                        users.forEach(user => {

                            if(element.UserID === user.ID){

                                //Parsing date into correct format
                                if(element.Start_Date === null){
                                    var datestart = "Not Started";
                                }else{
                                    var datestart = new Date(element.Start_Date);
                                    datestart = moment(datestart).format('DD-MMM-YYYY');
                                }
                        
                                //Populate task predecessor
                                $('#taskPredecesor').append($('<option>', {
                                    value: element.TaskID,
                                    text: element.Name,
                                }));

                                
                                // Check task type (Prepare array for datatable)
                                if (element.If_Milestone === false) {
                        
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
                        
                                }else if (element.If_Milestone === true) {
                        
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

                    //Allow view tasks if records > 0
                    var records = totalDisplayRecord = $("#taskTable").DataTable().page.info().recordsDisplay;
                    
                    if(records > 0){
                        var rowData = $("#taskTable").DataTable().rows().data();

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

                                    //Set up Dates
                                    if(value.Start_Date === null){
                                        document.getElementById("taskStartDate").innerHTML = "Not Started";
                                    }else{
                                        var datestart = new Date(value.Start_Date);
                                        document.getElementById("taskStartDate").innerHTML = moment(datestart).format('DD-MMM-YYYY');
                                    }

                                    if(value.Expected_Date === null){
                                        document.getElementById("taskExpDate").innerHTML = "Tasks Have Not Started";
                                    }else{
                                        var exp = new Date(value.Expected_Date);
                                        document.getElementById("taskExpDate").innerHTML = moment(exp).format('DD-MMM-YYYY');
                                    }

                                    var dateend = new Date(value.End_Date);
                                    var created = new Date(value.Date_Created);

                                    
                                    document.getElementById("taskEndDate").innerHTML =   moment(dateend).format('DD-MMM-YYYY');
                                    document.getElementById("taskCreatedDate").innerHTML =   moment(created).format('DD-MMM-YYYY');
                                }
                            })

                        });

                    }else{
                        document.getElementById("list").classList.toggle("d-none");
                        document.getElementById("no_tasksKanban").classList.toggle("d-none");
                        document.getElementById("grid").classList.toggle("d-none");
                    }

                
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

