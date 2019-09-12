$(document).ready(function () {

    //get ID from url
    var url = window.location.href;
    var file_array = [];
    var projectID = url.substring(url.lastIndexOf('?') + 1);

    var users = [];
    var user_object = {
        text: "",
        value: ""
    }

    var token = sessionStorage.getItem("token");
    var urlGetProjectID = 'https://datectestapi.azurewebsites.net/api/Projects/'+projectID;
    var urlGetProjectFiles = 'https://datectestapi.azurewebsites.net/api/GetFilesProjectID/'+projectID;
    var urlGetPorjectTeam = 'https://datectestapi.azurewebsites.net/api/GetMemebersProjectID/'+projectID;


    fetch(urlGetProjectID, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
    .then(function (j) {
        

        //get document id's to place data in
        var project_name =  document.getElementById("project_name_title");
        var project_name_side =  document.getElementById("project_name_side");
        var project_name_crumb =  document.getElementById("project_name_crumb");
        var project_client =  document.getElementById("project_client");
        var project_status  =  document.getElementById("project_status");
        var startDate =  document.getElementById("project_startDate");
        var endDate =  document.getElementById("project_endDate");
        var project_desc =  document.getElementById("project_desc");
        var project_percentage =  document.getElementById("project_percentage_text");
        var progress_meter  =  document.getElementById("progress_meter");
        var project_document  =  document.getElementById("document_list");
        
        //get dates only
        var start = j.Start_Date; 
        var end = j.End_Date;
        
        var datestart ="";
        var dateend ="";

        //get start date
        for (var i = 0; i < start.length; i++) {
            if(start.charAt(i) == "T"){
                break;
            }
            datestart += start.charAt(i);
        }

        //get end date
        for (var i = 0; i < end.length; i++) {
            if(start.charAt(i) == "T"){
                break;
            }
            dateend += start.charAt(i);
        }

        // Display critical status
        var critical = document.createElement("p");
        critical.classList.add('text-center','text-danger');
        critical.innerHTML = "! CRITICAL !"

        //generating edit button for project
        var button = document.createElement("button");
        button.classList.add('btn', 'btn-danger', 'btn-block', 'text-white',  'float-right', 'col-2');
        button.setAttribute("data-toggle","modal");
        button.setAttribute("data-target","#editProjectModel");
        button.setAttribute("disabled-target","true");
        button.setAttribute("id","edit_button");
        button.innerHTML = "Edit Project";

        //placing data inside ID's
        project_name.innerHTML = j.Name;

        project_name.appendChild(button);
        project_name_side.innerHTML = j.Name;
        project_name_crumb.innerHTML = j.Name;

        project_desc.innerHTML = j.Description;
        project_client.innerHTML = j.Client_Name;
        startDate.innerHTML = datestart;
        endDate.innerHTML = dateend;
        progress_meter.setAttribute("Style","width:"+j.Percentage+"%;")
        project_percentage.innerHTML = j.Percentage+"%";

        // Check critical project
        if(j.Critical_flag == true){
            //generating icon for project
            var icon = document.createElement("i");
            icon.classList.add('fas', 'fa-info-circle','text-red','ml-1');
            project_status.classList.add('text-danger','font-weight-bold','text-blink');
            project_status.innerHTML = "CRITICAL";
            project_status.appendChild(icon);
        }else{
            // Check project status
            if(j.Progress_Status == "OnGoing"){

                //generating icon for project
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-chevron-circle-right','text-blue','ml-1');
                project_status.innerHTML = "On Going";
                project_status.appendChild(icon);

            }else if(j.Progress_Status == "OnHold"){

                //generating icon for project
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-pause-circle','text-yellow','ml-1');
                project_status.innerHTML = "On Hold";
                project_status.appendChild(icon);

            }else if(j.Progress_Status == "Completed"){

                //generating icon for project
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-check-circle','text-green','ml-1');
                project_status.innerHTML = "Completed";
                project_status.appendChild(icon);

            }else if(j.Progress_Status == "Cancelled"){

                //generating icon for project
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-times-circle','text-red','ml-1');
                project_status.innerHTML = "Cancelled";
                project_status.appendChild(icon);

            }
        }

        //All members realted to project
        fetch(urlGetPorjectTeam, {
            async: false,
            method: 'GET',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function (a) { return a.json() })
        .then(function (k) {
            
            var ul = document.getElementById("user_list");
           
            // loop thorugh array of users and append them to the display list
            for(var i = 0; i< k.length; i++){
                // Collect user project into array for edit dropdown
                user_object.text = k[i].Username;
                user_object.value = k[i].ID;
                // console.log(user_object);

                users[i] = user_object;
                console.log(users);

                var li = document.createElement("li");
                var p = document.createElement("p");
                p.classList.add('text-info')
                p.innerHTML = k[i].Username + " - <div class='text-danger display-inline-block'>" + k[i].Department + "</div>";
                li.appendChild(p);
                ul.appendChild(li);
            }
            document.getElementById("load").style.display = "none";
            document.getElementById("container").classList.remove("display-none");

        }).catch(error => { console.error('Error:', error); return error; });

        //All files realted to project
        fetch(urlGetProjectFiles, {
            async: false,
            method: 'GET',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function (a) { return a.json() })
        .then(function (k) {
            var ul = document.getElementById("document_list");

            // loop thorugh array of users and append them to list
            for(var i = 0; i< k.length; i++){

                // storing files into array for edit modal use
                var files = {
                    'Name': k[i].Name,
                    'Directory': k[i].Directory
                }

                file_array.push(files);

                var li = document.createElement("li");
                var a = document.createElement("a");
                a.innerHTML ="<a href='" + k[i].Directory + "'>" +  k[i].Name  + "</a>";;
                li.appendChild(a);
                ul.appendChild(li);
            }
        }).catch(error => { console.error('Error:', error); return error; });

        
        document.getElementById("icon_container").classList.remove("display-none");
        document.getElementById("sidebarToggle").classList.remove("display-none");


        
        //Load data into Edit project modal
        $('#edit_button').on("click", function () {
            document.getElementById("projName").value = j.Name;
            document.getElementById("projDesc").value = j.Description;

            var ul = document.getElementById("edit_document_list");
            $('#edit_document_list').empty();

            function populateList(){

                for(var i = 0; i< file_array.length; i++){

                    var li = document.createElement("li");

                    var p = document.createElement("p");
                    p.innerHTML = file_array[i].Name;
    
                    var btn = document.createElement("button");
                    btn.classList.add('btn-circle','btn-danger','ml-2');
                    btn.id = file_array[i].Name;
                    btn.innerHTML = "X";
                    btn.onclick = function(){
                        console.log("CLicked");

                        for(var i = 0; i< file_array.length; i++){
                            if(file_array[i].Name == this.id){
                                file_array.splice(i,1);
                                $('#edit_document_list').empty();
                                populateList();
                            }
                        }
                           

                        $('#edit_document_list').empty();
                        populateList();
                    };
    
                    btn.setAttribute("type","button");
                    p.appendChild(btn);
                    li.appendChild(p);
                    ul.appendChild(li);
                }
            }

            populateList();
            
        });
            
        
    }).catch(error => { console.error('Error:', error); return error; });
});

