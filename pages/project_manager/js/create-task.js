function createTask(){
    //Urls
    var urlPostTask = urlMain + 'api/Tasks';

    //Get html values
    var taskName = document.getElementById("taskName").value;
    var type = document.getElementById("type").value;
    var taskDuration = document.getElementById("taskDuration").value;
    var taskPredecesor = document.getElementById("taskPredecesor").value;
    var taskDesc = document.getElementById("taskDesc").value;
    taskDuration = 5;

    //Setup dates for task
    var current_date = new Date();
    var Start = new Date(current_date);
    var End_date = "", count = 0;
    while(count < taskDuration){
        End_date = new Date(Start.setDate(Start.getDate() + 1));
        if(End_date.getDay() != 0 && End_date.getDay() != 6){
           count++;
        }
    }
    
    // Data encapsulation based on type
    if(type == "task"){
        var payload_task = {
            "UserID": userIdList[0],
            "Name": taskName,
            "Description": taskDesc,
            "Start_Date": current_date,
            "End_Date": End_date,
            "Status": true,
            "If_Milestone": false,
            "If_Objective": false,
            "PredecessorTaskID": taskPredecesor,
        }
    }else if(type == "objective"){
        var payload_task = {
            "UserID": userIdList[0],
            "Name": taskName,
            "Description": taskDesc,
            "Start_Date": current_date,
            "End_Date": End_date,
            "Status": true,
            "If_Milestone": false,
            "If_Objective": true,
            "PredecessorTaskID": taskPredecesor,
        }
    }else if(type == "milestone"){
        var payload_task = {
            "UserID": userIdList[0],
            "Name": taskName,
            "Description": taskDesc,
            "Start_Date": current_date,
            "End_Date": End_date,
            "Status": true,
            "If_Milestone": true,
            "If_Objective": false,
            "PredecessorTaskID": taskPredecesor,
        }
    }

    fetch(urlPostTask, {
        async: false,
        method: 'POST',
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload_task)
    }).then(response => response.json())
    .then((a) => {

        console.log(a);

    }).catch(error => { console.error('Error:', error); return error; });

}