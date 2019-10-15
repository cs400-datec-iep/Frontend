/*////////////////////////////////////

Function to create a project

*/////////////////////////////////////
function create_project() {
    //Urls
    urlPostProject = urlMain+'api/Projects';
    urlPostUserProject =  urlMain+'api/UserProjects';
    urlPostFiles =  urlMain+'api/Files';

    //Get html containers
    var projectName = document.getElementById("projName").value;
    var projClient = document.getElementById("projClient").value;
    var projDesc = document.getElementById("projDesc").value;
    var projStartDate = document.getElementById("projStartDate").value;
    var projDuration = document.getElementById("projDuration").value;
    var projBilled = document.getElementById("projBilled").value;
    var ProjectMangerId = sessionStorage.getItem("userID");

    //Calculate End date
    var Start = new Date(projStartDate);
    var projEndDate = "", count = 0;
    while(count < projDuration){
        projEndDate = new Date(Start.setDate(Start.getDate() + 1));
        if(projEndDate.getDay() != 0 && projEndDate.getDay() != 6){
           count++;
        }
    }

    //Validates selected members
    if(userIdList === undefined  || userIdList.length == 0){
        alert("Please add members!");
    }else{

        //Loading modal
        var btn = document.createElement("button");
        btn.id = "click";
        btn.setAttribute("data-toggle","modal");
        btn.setAttribute("data-target","#loader_work");
        btn.setAttribute("hidden","true");
        document.getElementById("content").appendChild(btn);
        $('#click').trigger('click');

        //Data encapsulation
        var payload_project = {
            'Name': projectName,
            'Description': projDesc,
            'Start_Date': projStartDate,
            'Project_managerID' : ProjectMangerId,
            'End_Date': projEndDate,
            'number_of_days': projDuration,
            'Client_Name': projClient,
            'Expected_Date': projEndDate,
            'Progress_Status': "OnGoing",
            'Percentage': 0,
            'Status': true,
            'amount_billed': projBilled,
            'amount_cost': projBilled,
            'Critical_flag': false
        };

        //Create project and returns ID of new project
        fetch(urlPostProject, {
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
            //Add Project Manager as a member
            userIdList.push(sessionStorage.getItem("userID"));

            //Loop for each user store project id and link users to project
            for (var i = 0; i < userIdList.length; i++) {

                //Data encapsulation
                var payload_user_project = {
                    'ProjectID': j.ProjectID,
                    'UserID': userIdList[i]
                }

                //Create Users in UserProject
                fetch(urlPostUserProject, {
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
            
            //Link uploaded files to the project ID 
            for (var i = 0; i < ArrayOfFiles.length; i++) {
                
                fetch(urlPostFiles, {
                    async: false,
                    method: 'POST',
                    crossDomain: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(ArrayOfFiles[i])
                }).then(function (a) {
                    
                    $("#loader_work").modal('hide');
                    localStorage.setItem('created_project',"true");
                    alert("Project created successfully");
                    window.location.href ="dashboard.html";

                }).catch(error => { console.error('Error:', error); return error; });
            }

        }).catch(error => { console.error('Error:', error); return error; });
    }    
}