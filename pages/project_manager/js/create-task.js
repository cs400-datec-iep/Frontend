function createTask(){
    //Urls
    var urlPostTask = urlMain + 'api/Tasks';

    //Get html values
    var taskName = document.getElementById("taskName").value;
    var type = document.getElementById("type").value;
    var taskDuration = document.getElementById("taskDuration").value;
    var taskDesc = document.getElementById("taskDesc").value;

    //Setup start date for task
    var current_date = new Date();
    
    // Data encapsulation based on type
    if(type == "task"){
        var payload_task = {
            "UserID": userIdList[0],
            "ProjectID": sessionStorage.getItem('ProjectID'),
            "Name": taskName,
            "Description": taskDesc,
            "Date_Created": current_date,
            "Expected_Date": null,
            "Start_Date": null,
            "End_Date": null,
            "Status": true,
            "If_Milestone": false,
            "If_Objective": false,
            "PredecessorTaskID": selected_tasks_array[0],
            "Number_of_days" : taskDuration,
            "Percentage" : 0,
            "Progress_Status": "Todo",
            "Critical_flag": false
        }
    }else if(type == "objective"){
        var payload_task = {
            "UserID": userIdList[0],
            "ProjectID": sessionStorage.getItem('ProjectID'),
            "Name": taskName,
            "Description": taskDesc,
            "Date_Created": current_date,
            "Expected_Date": null,
            "Start_Date": null,
            "End_Date": null,
            "Status": true,
            "If_Milestone": false,
            "If_Objective": true,
            "PredecessorTaskID": taskPredecesor,
            "Number_of_days" : taskDuration,
            "Percentage" : 0,
            "Progress_Status": "Todo",
            "Critical_flag": false
        }
    }else if(type == "milestone"){
        var payload_task = {
            "UserID": userIdList[0],
            "ProjectID": sessionStorage.getItem('ProjectID'),
            "Name": taskName,
            "Description": taskDesc,
            "Date_Created": current_date,
            "Expected_Date": null,
            "Start_Date": null,
            "End_Date": null,
            "Status": true,
            "If_Milestone": true,
            "If_Objective": false,
            "PredecessorTaskID": taskPredecesor,
            "Number_of_days" : taskDuration,
            "Percentage" : 0,
            "Progress_Status": "Todo",
            "Critical_flag": false
        }
    }

    console.log(payload_task);

    //Creates a task to the database
    fetch(urlPostTask, {
        async: false,
        method: 'POST',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload_task)
    }).then(response => response.json())
    .then((a) => {

        console.log(a);

    }).catch(error => { console.error('Error:', error); return error; });

}