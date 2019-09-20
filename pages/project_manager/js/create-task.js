function createTask(){
    //Urls
    var urlPostTask = urlMain + 'api/Tasks';

    //Get html values
    var taskName = document.getElementById("taskName").value;
    var type = document.getElementById("type").value;
    var taskDuration = document.getElementById("taskDuration").value;
    var taskPredecesor = document.getElementById("taskPredecesor").value;
    var taskDesc = document.getElementById("taskDesc").value;
    
    // Data encapsulation
    var payload_task = {
        "UserID": "sample string 2",
        "Name": "sample string 3",
        "Description": "sample string 4",
        "Start_Date": "2019-09-19T02:47:52.0259886+00:00",
        "End_Date": "2019-09-19T02:47:52.0259886+00:00",
        "Status": true,
        "If_Milestone": true,
        "If_Objective": true,
        "PredecessorTaskID": 10
    }

    fetch(urlPostTask, {
        async: false,
        method: 'POST',
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify()
    }).then(response => response.json())
    .then((a) => {

    }).catch(error => { console.error('Error:', error); return error; });

    console.log(taskName);
    console.log(type);
    console.log(taskDuration);
    console.log(taskPredecesor);
    console.log(taskDesc);
    console.log(userIdList);

}