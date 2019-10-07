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

        }).catch(error => { console.error('Error:', error); return error; });
    }).catch(error => { console.error('Error:', error); return error; });



});