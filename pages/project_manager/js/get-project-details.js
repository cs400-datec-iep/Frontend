$(document).ready(function () {

    //get ID from url
    var url = window.location.href;
    var projectID = url.substring(url.lastIndexOf('?') + 1);

    var token = sessionStorage.getItem("token");
    var urlGetProjectID = 'https://datectestapi.azurewebsites.net/api/Projects/'+projectID;

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

        //generating edit button for project
        var button = document.createElement("button");
        button.classList.add('btn', 'btn-danger', 'btn-block', 'text-white',  'float-right', 'col-2');
        button.setAttribute("data-toggle","modal");
        button.setAttribute("data-target","#editModal");
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
        progress_meter.setAttribute("style","width:"+project_percentage+"%;")
        project_percentage.innerHTML = j.Percentage+"%";

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

        document.getElementById("load").style.display = "none";
        document.getElementById("container").classList.remove("display-none");
        document.getElementById("icon_container").classList.remove("display-none");
        document.getElementById("sidebarToggle").classList.remove("display-none");

        console.log(j);
    })
    .catch(error => { console.error('Error:', error); return error; });
});
