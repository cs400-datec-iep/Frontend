/*////////////////////////////////////

Function to Display project details

*/////////////////////////////////////
$(document).ready(function () {
    //Get ID from url
    var url = window.location.href;
    var projectID = url.substring(url.lastIndexOf('?') + 1);

    //Urls
    var urlGetProjectByID = urlMain+'api/Projects/'+projectID;
    var urlGetProjectFiles = urlMain+'api/GetFilesProjectID/'+projectID;
    var urlGetProjectTeam = urlMain+'api/GetMembersProjectID/'+projectID;

    //Get project details
    fetch(urlGetProjectByID, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
    .then(function (j) {

        //Get html Containers
        var page_title =  document.getElementById("page_title");
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
        var project_duration  =  document.getElementById("project_duration");
        var project_billed  =  document.getElementById("project_billed");
        var project_cost  =  document.getElementById("project_cost");
        
        //Get dates only
        var start = j.Start_Date; 
        var end = j.End_Date;
        
        var datestart ="";
        var dateend ="";

        //Get start date
        for (var i = 0; i < start.length; i++) {
            if(start.charAt(i) == "T"){
                break;
            }
            datestart += start.charAt(i);
        }

        //Get end date
        for (var i = 0; i < end.length; i++) {
            if(end.charAt(i) == "T"){
                break;
            }
            dateend += end.charAt(i);
        }

        // Parsing date in dd/mm/yyyyy
        var datestart = new Date(datestart);
        var dateend = new Date(dateend);

        startDate.innerHTML = moment(datestart).format('DD-MMM-YYYY');
        endDate.innerHTML =   moment(dateend).format('DD-MMM-YYYY');
        project_duration.innerHTML = j.number_of_days+" Days";

        //set project billing information 
        project_cost.innerHTML = "$"+j.amount_cost;
        project_billed.innerHTML = "$"+j.amount_billed;

        //Display critical status
        var critical = document.createElement("p");
        critical.classList.add('text-center','text-danger');
        critical.innerHTML = "! CRITICAL !";
        
        // Set session var for project name and project ID
        sessionStorage.setItem('ProjectName',j.Name);
        sessionStorage.setItem('ProjectID',j.ProjectID);

        //Appending data onto the html containers
        page_title.innerHTML = j.Name;
        project_name.innerHTML = j.Name;

        project_name_side.innerHTML = j.Name;
        project_name_crumb.innerHTML = j.Name;

        project_desc.innerHTML = j.Description;
        project_client.innerHTML = j.Client_Name;

        progress_meter.setAttribute("Style","width:"+j.Percentage+"%;")
        project_percentage.innerHTML = j.Percentage+"%";

        // Check critical project
        if(j.Critical_flag == true){
            //Diplsay Critial Status
            var icon = document.createElement("i");
            icon.classList.add('fas', 'fa-info-circle','text-red','ml-1');
            project_status.classList.add('text-danger','font-weight-bold','text-blink');
            project_status.innerHTML = "CRITICAL";
            project_status.appendChild(icon);
        }else{
            // Check Project status and display
            if(j.Progress_Status == "OnGoing"){
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-chevron-circle-right','text-blue','ml-1');
                project_status.innerHTML = "On Going";
                project_status.appendChild(icon);

            }else if(j.Progress_Status == "OnHold"){
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-pause-circle','text-yellow','ml-1');
                project_status.innerHTML = "On Hold";
                project_status.appendChild(icon);

            }else if(j.Progress_Status == "Completed"){
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-check-circle','text-green','ml-1');
                project_status.innerHTML = "Completed";
                project_status.appendChild(icon);

            }else if(j.Progress_Status == "Cancelled"){
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-times-circle','text-red','ml-1');
                project_status.innerHTML = "Cancelled";
                project_status.appendChild(icon);
            }
        }

        //Get members related to project
        fetch(urlGetProjectTeam, {
            async: false,
            method: 'GET',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(function (a) { return a.json() })
        .then(function (k) {
            //Get html container
            var ul = document.getElementById("user_list");

            //Loop thorugh array of users and append them to the display list
            for(var i = 0; i< k.length; i++){
                userIdList.push(k[i].ID);

                var li = document.createElement("li");
                var p = document.createElement("p");
                p.classList.add('text-info')
                p.innerHTML = k[i].Username + " - <div class='text-danger display-inline-block'>" + k[i].Department + "</div>";
                li.appendChild(p);
                ul.appendChild(li);
            }

            //Remove loading icon and display output
            document.getElementById("load").style.display = "none";
            document.getElementById("container").classList.remove("display-none");

        }).catch(error => { console.error('Error:', error); return error; });

        //Get files related to project
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
            //Get html container
            var ul = document.getElementById("document_list");

            //Loop thorugh array of users and append them to list
            for(var i = 0; i< k.length; i++){

                //Storing files into array for edit modal use
                var files = {
                    'Name': k[i].Name,
                    'Directory': k[i].Directory,
                    'FileID': k[i].FileID,
                    'ProjectID': k[i].ProjectID
                }

                file_array.push(files);

                //Append project team members to html list container
                var li = document.createElement("li");
                var a = document.createElement("a");
                a.innerHTML ="<a href='" + k[i].Directory + "'>" +  k[i].Name  + "</a>";;
                li.appendChild(a);
                ul.appendChild(li);
            }
        }).catch(error => { console.error('Error:', error); return error; });

        //Remove loading icon and display output for sidebar
        document.getElementById("icon_container").classList.remove("display-none");
        document.getElementById("sidebarToggle").classList.remove("display-none");

    }).catch(error => { console.error('Error:', error); return error; });
});

