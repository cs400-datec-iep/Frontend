/*////////////////////////////////////

Function to edit project details

*/////////////////////////////////////
function editProject() {

    //Validate Edit
    if (confirm('Are you sure you want to save your changes?')) {
        //Get ID from url
        var url = window.location.href;
        var projectID = url.substring(url.lastIndexOf('?') + 1);

        //Urls
        var urlPutProjectID = urlMain+'api/Projects/' + projectID;
        var urlPostUserProject = urlMain+'api/UserProjects/' + projectID;
        var URLDeleteProjectMembers = urlMain+'api/DeleteUserProjectUsingProject/' + projectID;
        var urlFiles = urlMain+'/api/Files';
        var wait = false;

        //Get values from html elements
        var projectName = document.getElementById("projName").value;
        var projClient = document.getElementById("project_client").value;
        var projDesc = document.getElementById("projDesc").value;
        var project_startDate = document.getElementById("project_startDate").value;
        var project_duration = document.getElementById("project_duration").value;
        var project_endDate = document.getElementById("project_endDate").value;
        var project_status = document.getElementById("project_status").value;
        var status = document.getElementById("status").value;
        var project_percentage = document.getElementById("project_percentage").value;
        var project_critical = document.getElementById("project_critical").value;
        var project_cost = document.getElementById("projCost").value;
        var project_billed = document.getElementById("projBilled").value;
        var ProjectMangerId = sessionStorage.getItem("userID");

        //Data encapsulation
        var payload_project = {
            'ProjectID': projectID,
            'Name': projectName,
            'Description': projDesc,
            'Start_Date': project_startDate,
            'Project_managerID': ProjectMangerId,
            'number_of_days': project_duration,
            'End_Date': project_endDate,
            'Client_Name': projClient,
            'Expected_Date': project_endDate,
            'Progress_Status': project_status,
            'Percentage': project_percentage,
            'Status': status,
            'Critical_flag': project_critical,
            'amount_billed': project_cost,
            'amount_cost': project_billed,
        }

        //Delete all  members in UserProject
        fetch(URLDeleteProjectMembers, {
            async: false,
            method: 'DELETE',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        }).then(function (a) {
            wait = true;
            //Link users to project
            for (var i = 0; i < userIdList.length; i++) {

                //Data encapsulation
                var payload_user_project = {
                    'ProjectID': projectID,
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
            wait = false;

            //Add new files
            for (var i = 0; i < ArrayOfFiles.length; i++) {
                fetch(urlFiles, {
                    async: false,
                    method: 'POST',
                    crossDomain: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(ArrayOfFiles[i])
                }).catch(error => { console.error('Error:', error); return error; });
            }
    
            //Delete old files
            for (var i = 0; i < deleted_file_array.length; i++) {
                var urlDeleteFiles = urlMain+'api/Files/' + deleted_file_array[i];
    
                fetch(urlDeleteFiles, {
                    async: false,
                    method: 'DELETE',
                    crossDomain: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                }).catch(error => { console.error('Error:', error); return error; });
            }
    
            //Edit Project Details
            fetch(urlPutProjectID, {
                async: false,
                method: 'PUT',
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(payload_project)
            }).then(function (a) { 
                
                while(wait == true){
    
                }
                alert("Project successfully edited");   
                window.location.assign("view_project.html?"+projectID);
    
            }).catch(error => { console.error('Error:', error); return error; });
            
            //Clear delete cache arrays
            deleted_members_array.length = 0;
            deleted_file_array.length = 0;


        }).catch(error => { console.error('Error:', error); return error; });
        
    } 

}