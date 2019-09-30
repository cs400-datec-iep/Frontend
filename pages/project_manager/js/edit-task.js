/*////////////////////////////////////

Function to edit task

*/////////////////////////////////////
function editTask(){
    //Url's
    var urlEditTask = urlMain + 'api/Tasks/' + sessionStorage.getItem('taskID');

    //Get input values
    var taskName = document.getElementById("taskName").value;
    var taskStatus = document.getElementById("taskStatus").value;
    var taskType = document.getElementById("taskType").value;
    var taskDuration = document.getElementById("taskDuration").value;
    var taskPredecesor = document.getElementById("taskPredecesor").value;
    var members_list = document.getElementById("members_list").value;
    var taskDesc = document.getElementById("taskDesc").value;
    var project_critical = document.getElementById("project_critical").value;
    var status = document.getElementById("status").value;
    var percentageRange = document.getElementById("percentageRange").value;


    //Set up dates
    if(sessionStorage.getItem('startDate') === null){
        var createdDate = new Date(sessionStorage.getItem('createdDate'));
        var startDate = null;
        var endDate = null;
        var expDate = null;

    }else{
        //Expected Completion Date
        var createdDate = new Date(sessionStorage.getItem('createdDate'));
        var startDate = new Date(sessionStorage.getItem('startDate'));
        var endDate = new Date(sessionStorage.getItem('endDate'));
        var expDate = "", count = 0;
        while(count < taskDuration){
            expDate = new Date(createdDate.setDate(createdDate.getDate() + 1));

            if(expDate.getDay() != 0 && expDate.getDay() != 6){
            count++;
            }
        }

    }

    if(taskType === "task"){

        //Data encapsulation
        var payload_task = {
            "TaskID": sessionStorage.getItem('taskID'),
            "UserID": members_list,
            "ProjectID": sessionStorage.getItem('ProjectID'),
            "Name": taskName,
            "Description": taskDesc,
            "Date_Created": createdDate,
            "Expected_Date": expDate,
            "Start_Date": startDate,
            "End_Date": endDate,
            "Status": status,
            "If_Milestone": false,
            "If_Objective": false,
            "PredecessorTaskID": taskPredecesor,
            "Number_of_days": taskDuration,
            "Percentage": percentageRange,
            "Progress_Status": taskStatus,
            "Critical_flag": project_critical
        }

    }else if(taskType === "objective"){

        //Data encapsulation
        var payload_task = {
            "TaskID": sessionStorage.getItem('taskID'),
            "UserID": members_list,
            "ProjectID": sessionStorage.getItem('ProjectID'),
            "Name": taskName,
            "Description": taskDesc,
            "Date_Created": createdDate,
            "Expected_Date": expDate,
            "Start_Date": startDate,
            "End_Date": endDate,
            "Status": status,
            "If_Milestone": false,
            "If_Objective": true,
            "PredecessorTaskID": taskPredecesor,
            "Number_of_days": taskDuration,
            "Percentage": percentageRange,
            "Progress_Status": taskStatus,
            "Critical_flag": project_critical
        }

    }else if(taskType === "milestone"){

        //Data encapsulation
        var payload_task = {
            "TaskID": sessionStorage.getItem('taskID'),
            "UserID": members_list,
            "ProjectID": sessionStorage.getItem('ProjectID'),
            "Name": taskName,
            "Description": taskDesc,
            "Date_Created": createdDate,
            "Expected_Date": expDate,
            "Start_Date": startDate,
            "End_Date": endDate,
            "Status": status,
            "If_Milestone": true,
            "If_Objective": false,
            "PredecessorTaskID": taskPredecesor,
            "Number_of_days": taskDuration,
            "Percentage": percentageRange,
            "Progress_Status": taskStatus,
            "Critical_flag": project_critical
        }

    }

    fetch(urlEditTask, {
        async: false,
        method: 'PUT',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload_task)
    }).then((response) =>{

        alert("Your task has been edited, the page will now reload");
        window.location.assign("view_task_details.html?"+sessionStorage.getItem('taskID'));
        
    }).catch(error => { console.error('Error:', error); return error; });



}