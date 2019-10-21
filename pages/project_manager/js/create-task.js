function createTask(){
    //Urls
    var urlPostTask = urlMain + 'api/Tasks';

    //Get html values
    var taskName = document.getElementById("taskName").value;
    var IfMilestone = document.getElementById("IfMilestone").checked;
    var taskDuration = document.getElementById("taskDuration").value;
    var taskDesc = document.getElementById("taskDesc").value;


    $("#createTaskModal").modal('hide');
    //Loading modal
    var btn = document.createElement("button");
    btn.id = "click";
    btn.setAttribute("data-toggle","modal");
    btn.setAttribute("data-target","#loader_work");
    btn.setAttribute("hidden","true");
    document.getElementById("wrapper").appendChild(btn);
    $('#click').trigger('click');

    //Setup start date for task
    var current_date = new Date();
    var Start = new Date();
    var end_date = "", count = 0;
    while(count < taskDuration){
        end_date = new Date(Start.setDate(Start.getDate() + 1));
        if(end_date.getDay() != 0 && end_date.getDay() != 6){
           count++;
        }
    }
    
    // Data encapsulation based on type
    if(IfMilestone == true){//Is a milestone
        var payload_task = {
            "UserID": null,
            "ProjectID": sessionStorage.getItem('ProjectID'),
            "Name": taskName,
            "Description": taskDesc,
            "Date_Created": current_date,
            "Expected_Date": null,
            "Start_Date": null,
            "End_Date": null,
            "Status": true,
            "If_Milestone": true,
            "PredecessorTaskID": 0,
            "Number_of_days" : 0,
            "Percentage" : 0,
            "Progress_Status": "Todo",
            "Critical_flag": false
        }
    }else if(IfMilestone == false){//Is a task
        var payload_task = {
            "UserID": userIdList[0],
            "ProjectID": sessionStorage.getItem('ProjectID'),
            "Name": taskName,
            "Description": taskDesc,
            "Date_Created": current_date,
            "Expected_Date": end_date,
            "Start_Date": null,
            "End_Date": null,
            "Status": true,
            "If_Milestone": false,
            "PredecessorTaskID":  selected_tasks_array[0],
            "Number_of_days" : taskDuration,
            "Percentage" : 0,
            "Progress_Status": "Todo",
            "Critical_flag": false
        }
    }

    // // //Creates a task to the database
    fetch(urlPostTask, {
        async: false,
        method: 'POST',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload_task)
    }).then((a) => {

        alert("Task has been created, the page will now refresh.");
        window.location.assign("task_view.html?"+sessionStorage.getItem('ProjectID'));

    }).catch(error => { console.error('Error:', error); return error; });

}