/*////////////////////////////////////

Function to edit project details

*/////////////////////////////////////
function editProject() {

    //Validate Edit
    if (confirm('Are you sure you want to save your changes?')) {
        $("#editProjectModel").modal('hide');

       //Loading modal
       var btn = document.createElement("button");
       btn.id = "click";
       btn.setAttribute("data-toggle","modal");
       btn.setAttribute("data-target","#loader_work");
       btn.setAttribute("hidden","true");
       document.getElementById("wrapper").appendChild(btn);
       $('#click').trigger('click');

        //Get ID from url
        var url = window.location.href;
        var projectID = url.substring(url.lastIndexOf('?') + 1);

        //Urls
        var urlPutProjectID = urlMain+'api/Projects/' + projectID;
        var urlPostUserProject = urlMain+'api/UserProjects/' + projectID;
        var URLDeleteProjectMembers = urlMain+'api/DeleteUserProjectUsingProject/' + projectID;
        var urlFileUpload = urlMain+'api/FileUpload/'+ projectID;
        var wait = false;

        //Get values from html elements
        var projectName = document.getElementById("projName").value;
        var projClient = sessionStorage.getItem("project_client");
        var projDesc = document.getElementById("projDesc").value;
        var project_startDate = sessionStorage.getItem("project_startDate");
        var project_duration = sessionStorage.getItem("project_duration");
        var project_endDate =  sessionStorage.getItem("project_endDate");
        var project_expendDate =  sessionStorage.getItem("project_expendDate");
        var project_status = document.getElementById("project_status").value;
        var status = document.getElementById("status").value;
        var project_percentage =  sessionStorage.getItem("project_percentage");
        var project_critical = sessionStorage.getItem("project_critical");
        var project_cost = document.getElementById("projCost").value;
        var project_billed = document.getElementById("projBilled").value;
        var ProjectMangerId = sessionStorage.getItem("userID");

        if(project_endDate === "null"){
            project_endDate = null;
        }


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
            'Expected_Date': project_expendDate,
            'Progress_Status': project_status,
            'Percentage': project_percentage,
            'Status': status,
            'Critical_flag': project_critical,
            'amount_billed': project_cost,
            'amount_cost': project_billed,
        }

        console.log(typeof(project_endDate));

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
                const formData = new FormData();
                formData.append('', ArrayOfFiles[i]);

                const options = {
                    method: 'POST',
                    body: formData,
                    // If you add this, upload won't work
                    // headers: {
                    //   'Content-Type': 'multipart/form-data',
                    // }
                };
                fetch(urlFileUpload, options)
                .catch(error => { console.log(error) });
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