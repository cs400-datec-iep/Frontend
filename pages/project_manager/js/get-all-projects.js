$(document).ready(function () {

    var ProjectManagerID = sessionStorage.getItem("userID");
    var token = sessionStorage.getItem("token");
    var url = 'https://datectestapi.azurewebsites.net/api/GetProjectsForPM/' + ProjectManagerID;


    //Get projects based on manager id
    fetch(url, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
        .then(function (j) {

            document.getElementById("load").style.display = "none";
            var i;

            if(j.Result.length == 0){
                document.getElementById("no_project").style.display = "inline-block";
            }

            for (i = 0; i < j.Result.length; i++) {

                if(j.Result[i].Status == true){
                    //creating project card
                    var projectName = j.Result[i].Name;
                    var projectDesc = j.Result[i].Description;
                    var projectID = j.Result[i].ProjectID;
                    var projectPercentage = j.Result[i].Percentage;
                    var projectSatus = j.Result[i].Progress_Status;
                    var projectCritical = j.Result[i].Critical_flag;


                    //Check status
                    if(projectSatus == "OnGoing"){

                        var status = document.createElement("div");
                        status.classList.add('text-sm','font-weight-normal','text-green', 'text-uppercase', 'mb-1','float-right');
                        status.innerHTML = "On Going";

                    }else if(projectSatus == "OnHold"){

                        var status = document.createElement("div");
                        status.classList.add('text-sm','font-weight-normal','text-yellow', 'text-uppercase', 'mb-1','float-right');
                        status.innerHTML = "On Hold";

                    }else if(projectSatus == "Completed"){

                        var status = document.createElement("div");
                        status.classList.add('text-sm','font-weight-normal','text-green', 'text-uppercase', 'mb-1','float-right');
                        status.innerHTML = "Completed";

                    }else if(projectSatus == "Cancelled"){

                        var status = document.createElement("div");
                        status.classList.add('text-sm','font-weight-normal','text-red', 'text-uppercase', 'mb-1','float-right');
                        status.innerHTML = "Cancelled";

                    }

                    //get container to put elements in
                    var container = document.getElementById("container");

                    //create elements
                    var a = document.createElement('div');
                    a.classList.add('col-xl-5', 'col-sm-6', 'mb-4', 'mt-3','ml-5');

                    var card = document.createElement("a");
                    card.classList.add('card', 'border-left-primary', 'shadow','o-hidden', 'h-100', 'py-2');
                    card.href = "view_project.html?" + projectID;

                    var cardbody = document.createElement("div");
                    cardbody.classList.add('card-body');

                    var col1 = document.createElement("div");
                    cardbody.classList.add('col','mr-2');

                    var header = document.createElement("div");
                    header.classList.add('text-xlg','font-weight-bold','text-primary', 'text-uppercase', 'mb-1');
                    header.innerHTML = projectName;

                    var paragraph = document.createElement("div");
                    paragraph.classList.add('text-sm','h5','mb-0', 'font-weight-bold', 'text-gray-800','text-truncate');
                    paragraph.innerHTML = projectDesc;

                    var col2 = document.createElement("div");
                    cardbody.classList.add('col-auto');

                    var icon = document.createElement("i");
                    icon.classList.add('fas','fa-calendar','fa-2x', 'text-gray-300');

                    var progressHeader = document.createElement("h4");
                    progressHeader.classList.add('small','font-weight-bold','mt-1');
                    progressHeader.innerHTML = '&nbsp';

                    var progressPercnetage = document.createElement("span");
                    progressPercnetage.classList.add('float-right');
                    progressPercnetage.innerHTML = projectPercentage + "%";

                    var progressBarDiv = document.createElement("div");
                    progressBarDiv.classList.add('progress');

                    var progressBar = document.createElement("div");
                    progressBar.classList.add('progress-bar-stripe','bg-success');
                    progressBar.setAttribute("role", "progressbar");
                    progressBar.setAttribute("style", "width:" + projectPercentage + "%");

                    // Check project critical flag
                    if(projectCritical == true){
                        card.classList.add('blink');
                        // paragraph.classList.remove('text-gray-800');
                        // header.classList.remove('text-primary');

                        // paragraph.classList.add('text-white');
                        // header.classList.add('text-white');
                        var status = document.createElement("div");
                        status.classList.add('text-sm','font-weight-bold','font-weight-normal','text-danger', 'text-uppercase', 'mb-1','float-right');
                        status.innerHTML = "CRITICAL !";
                    }

                    //Generating the elements
                    a.appendChild(card);
                    card.appendChild(cardbody);
                    cardbody.appendChild(col1);
                    header.appendChild(status);
                    cardbody.appendChild(header);
                    cardbody.appendChild(paragraph);
                    cardbody.appendChild(col2);
                    cardbody.appendChild(progressHeader);
                    progressHeader.appendChild(progressPercnetage);
                    cardbody.appendChild(progressBarDiv);
                    progressBarDiv.appendChild(progressBar);

                    //place generated elements into container  
                    container.append(a);
                }    

            }

            
            document.getElementById("container").style.display = "";

        })
        .catch(error => { console.error('Error:', error); return error; });

});