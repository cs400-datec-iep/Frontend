 /*////////////////////////////////////

Function to Display task details

*/////////////////////////////////////
$(document).ready(function () {
    //Get ID from url
    var url = window.location.href;
    var taskID = url.substring(url.lastIndexOf('?') + 1);

    //Urls
    var urlGetTaskDetails = urlMain + "api/Tasks/"+taskID;
    var urlGetUsers = urlMain + "api/UserMains";

    // Get task details
    fetch(urlGetTaskDetails, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => response.json())
    .then((a) => {

        // Get Users for dropdown and get user for task
        fetch(urlGetUsers, {
            async: false,
            method: 'GET',
            crossDomain: true,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(response => response.json())
        .then((j) => {
            //Linking data result to html containers
            document.getElementById("project_name_side").innerHTML = sessionStorage.getItem('ProjectName');
            var task_type;
            
            //Making Breadcrumb links
            var link = document.createElement("a");
            link.setAttribute("href","view_project.html?"+ sessionStorage.getItem('ProjectID'));
            link.innerHTML = sessionStorage.getItem('ProjectName');
            document.getElementById("project_name_crumb").appendChild(link);
            document.getElementById("task_name_crumb").innerHTML = a.Name;

            // Check task type
            if(a.If_Milestone === false && a.If_Objective === false){

                task_type = "task";

            }else if(a.If_Objective === true && a.If_Milestone === false){

                task_type = "objective";

            }else if(a.If_Milestone === true && a.If_Objective === false){

                task_type = "milestone";

            }

            document.getElementById("task_name_title").innerHTML = a.Name;

            //Set Dropdown values for members
            j.forEach(element => {

                if(a.UserID === element.ID){
                    document.getElementById("task_assigned_to").innerHTML = element.Username;
                    $('#members_list').append($('<option>', {
                        value: element.ID,
                        text: element.Username,
                        selected: true
                    }));
                }else{
                
                    $('#members_list').append($('<option>', {
                        value: element.ID,
                        text: element.Username,
                    }));

                }
            });
            //Set Dropdown values for tasks

            console.log(a);
            

            // Check status and critical
            if(a.Critical_flag == true){
                
            }else{
                // Check Project status and display
                if(a.Progress_Status == "OnGoing"){
                  
                    document.getElementById("task_status").innerHTML ="On Going";
    
                }else if(a.Progress_Status == "OnHold"){
                   
                    document.getElementById("task_status").innerHTML ="On Hold";
    
                }else if(a.Progress_Status == "Completed"){
               
                    document.getElementById("task_status").innerHTML ="Completed";
        
                }else if(alert.Progress_Status == "Cancelled"){
                   
                    document.getElementById("task_status").innerHTML ="Cancelled";
    
                }
            }


            //Parsing date into correct format
            var datestart = new Date(a.Start_Date);
            datestart = moment(datestart).format('DD-MMM-YYYY');
            var dateend = new Date(a.End_Date);
            dateend = moment(dateend).format('DD-MMM-YYYY');
           
            document.getElementById("task_start_date").innerHTML = datestart;
            document.getElementById("task_end_date").innerHTML = dateend;
            document.getElementById("task_duration").innerHTML = a.Number_of_days;
            
            document.getElementById("progress_meter").setAttribute("Style","width:"+a.Percentage+"%;")
            document.getElementById("task_percentage").innerHTML = a.Percentage+"%";

            document.getElementById("task_desc").innerHTML = a.Description;

            // Setting links with project ID
            document.getElementById('view_project_link').setAttribute("href","view_project.html?"+ sessionStorage.getItem('ProjectID'));
            document.getElementById('page_title').innerHTML =  sessionStorage.getItem('ProjectName');
            
            //Create edit button for task
            var button = document.createElement("button");
            button.classList.add('btn', 'btn-danger', 'btn-block', 'text-white',  'float-right', 'col-md-2');
            button.setAttribute("data-toggle","modal");
            button.setAttribute("data-target","#editTaskModal");
            button.setAttribute("disabled-target","true");
            button.setAttribute("id","edit_button");
            button.onclick = function(){

                //Set edit modal input fields
                document.getElementById("taskName").value = a.Name;
                document.getElementById("taskStatus").value = "";
                document.getElementById("taskType").value = task_type;
                document.getElementById("taskDuration").value = a.Number_of_days;
                document.getElementById("taskDesc").value = a.Description;

                var task_array = JSON.parse(sessionStorage.getItem('task_array'));

                task_array.forEach(element => {

                    if(element.taskID === a.taskID){
                        $('#taskPredecesor').append($('<option>', {
                            value: element.taskID,
                            text: element.Name,
                            selected: true
                        }));
                    }else{
                        $('#taskPredecesor').append($('<option>', {
                            value: element.taskID,
                            text: element.Name,
                        }));
                    }
                });
               
            };
            button.innerHTML = "Edit Task";

            task_name_title.appendChild(button);

            //Remove loading icon and display output
            document.getElementById("load").style.display = "none";
            document.getElementById("container").classList.remove("display-none");

            //Remove loading icon and display output for sidebar
            document.getElementById("icon_container").classList.remove("display-none");
            document.getElementById("sidebarToggle").classList.remove("display-none");

        }).catch(error => { console.error('Error:', error); return error; });
        
    }).catch(error => { console.error('Error:', error); return error; });
})