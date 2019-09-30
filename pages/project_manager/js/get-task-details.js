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

            // Check status and critical
            if(a.Critical_flag == true){
                
            }else{
                // Check Project status and display
                if(a.Progress_Status == "Todo"){
                  
                    document.getElementById("task_status").innerHTML ="To Do";
    
                }else if(a.Progress_Status == "Doing"){
                   
                    document.getElementById("task_status").innerHTML ="Doing";
    
                }else if(a.Progress_Status == "Done"){
               
                    document.getElementById("task_status").innerHTML ="Done";
        
                }
            }

            //Setup Dates
            if(a.Start_Date === null){
                //Parsing date into correct format
                var datecreated = new Date(a.Date_Created);
                datecreated = moment(datecreated).format('DD-MMM-YYYY');

                document.getElementById("task_Created_date").innerHTML = datecreated;
                document.getElementById("task_expected").innerHTML = "Not Started";
                document.getElementById("task_start").innerHTML = "Not Started";
                document.getElementById("task_end_date").innerHTML = "Not Started";
            }else{
                //Parsing date into correct format
                var datecreated = new Date(a.Date_Created);
                datecreated = moment(datecreated).format('DD-MMM-YYYY');

                //Date Task completed work
                var dateend = new Date(a.End_Date);
                dateend = moment(dateend).format('DD-MMM-YYYY');

                //Date Task started work
                var datestart = new Date(a.Start_Date);
                datestart = moment(datestart).format('DD-MMM-YYYY');

                //Calculate expected date
                var dateexp = "", count = 0;
                while(count < a.Number_of_days){
                    dateexp = new Date(datecreated.setDate(datecreated.getDate() + 1));

                    if(dateexp.getDay() != 0 && datecreated.getDay() != 6){
                    count++;
                    }
                }
            
                document.getElementById("task_Created_date").innerHTML = datecreated;
                document.getElementById("task_expected").innerHTML = dateexp;
                document.getElementById("task_start").innerHTML = datestart;
                document.getElementById("task_end_date").innerHTML = dateend;
            }

            document.getElementById("task_duration").innerHTML = a.Number_of_days;
            document.getElementById("progress_meter").setAttribute("Style","width:"+a.Percentage+"%;")
            document.getElementById("task_percentage").innerHTML = a.Percentage+"%";
            document.getElementById("task_desc").innerHTML = a.Description;
            document.getElementById("task_type").innerHTML = "Type: "+task_type;

            //Get task array from previous page
            var task_array = JSON.parse(sessionStorage.getItem('task_array'));

            task_array.forEach(element => {

                if(element.TaskID === a.TaskID){
                    $('#taskPredecesor').append($('<option>', {
                        value: element.TaskID,
                        text: element.Name,
                        selected: true
                    }));
                    
                    if(a.TaskID === "0"){
                        document.getElementById('predecessor_task').innerHTML = "Parent Task: None" ;
                    }else{
                        document.getElementById('predecessor_task').innerHTML = "Parent Task:" + element.Name + "[ID:"+ element.TaskID + "]" ;
                    }

                }else{
                    $('#taskPredecesor').append($('<option>', {
                        value: element.TaskID,
                        text: element.Name,
                    }));

                    document.getElementById('predecessor_task').innerHTML = "Parent Task: None" ;
                }
            });

            //Setup range slider for percentage
            document.getElementById("value").innerHTML = a.Percentage+"%";
            document.getElementById("percentageRange").value = a.Percentage;

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
                document.getElementById("taskStatus").value = a.Progress_Status;
                document.getElementById("status").value = a.Status;
                document.getElementById("project_critical").value = a.Critical_flag;
                document.getElementById("taskType").value = task_type;
                document.getElementById("taskDuration").value = a.Number_of_days;
                document.getElementById("taskDesc").value = a.Description;

                //Set task ID as session and start date as session
                sessionStorage.setItem('taskID',a.TaskID);
                sessionStorage.setItem('startDate',a.Start_Date);
                sessionStorage.setItem('endDate',a.End_Date);
                sessionStorage.setItem('expDate',a.Expected_Date);
                sessionStorage.setItem('createdDate',a.Date_Created);

               
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