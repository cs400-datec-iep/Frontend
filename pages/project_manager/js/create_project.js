function create_project() {
    //get input values
    var projectName = document.getElementById("projName").value;
    var projClient = document.getElementById("projClient").value;
    var projDesc = document.getElementById("projDesc").value;
    var projStartDate = document.getElementById("projStartDate").value;
    var projEndDate = document.getElementById("projEndDate").value;
    var ProjectMangerId = sessionStorage.getItem("userID");
    var userIdList = JSON.parse(localStorage.getItem("userIDs"));
    var FileArray = JSON.parse(localStorage.getItem("ArrayOfFiles"));


    token = sessionStorage.getItem("token");
    urlGetProjectID = 'https://datectestapi.azurewebsites.net/api/Projects';
    urlUserProject = 'https://datectestapi.azurewebsites.net/api/UserProjects';
    urlFiles = 'https://datectestapi.azurewebsites.net/api/Files';


    if (projStartDate > projEndDate) {
        alert("Dates do not match!");
    } else if (projStartDate == projEndDate) {
        alert("Dates do not match!");
    } else {

        //data encapsulation
        var payload_project = {
            'Name': projectName,
            'Description': projDesc,
            'Start_Date': projStartDate,
            'Project_managerID' : ProjectMangerId,
            'End_Date': projEndDate,
            'Client_Name': projClient,
            'Expected_Date': projEndDate,
            'Progress_Status': "OnGoing",
            'Percentage': 0,
            'Status': true,
            'Critical_flag': false
        };

        //create project and returns ID of new project
        fetch(urlGetProjectID, {
            async: false,
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload_project)
        }).then(function (a) { return a.json() })
            .then(function (j) {

                //get user count for selected members
                //link users to project
                for (var i = 0; i < userIdList.length; i++) {

                    //data encapsulation
                    var payload_user_project = {
                        'ProjectID': j.ProjectID,
                        'UserID': userIdList[i]
                    }
                    //create Users in UserProject
                    fetch(urlUserProject, {
                        async: false,
                        method: 'POST',
                        crossDomain: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify(payload_user_project)
                    }).catch(error => { console.error('Error:', error); return error; });
                }

                //link uploaded file to the project ID
                for (var i = 0; i < FileArray.length; i++) {

                    //data encapsulation
                    var payload_files = {
                        'ProjectID': j.ProjectID,
                        'Name': FileArray[i].Name,
                        'Type': FileArray[i].Type,
                        'Directory': FileArray[i].Directory
                    }

                    fetch(urlFiles, {
                        async: false,
                        method: 'POST',
                        crossDomain: true,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify(payload_files)
                    }).catch(error => { console.error('Error:', error); return error; });

                }
            })
            .catch(error => { console.error('Error:', error); return error; });
    }

    $('#successModal').modal('show');
}