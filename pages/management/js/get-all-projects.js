/*////////////////////////////////////

Function to get and display all projects in system
*/////////////////////////////////////
$(document).ready(function () {
    //Urls
    var urlGetUserProjects = urlMain+'api/Projects' ;

    //Get all projects in the system
    fetch(urlGetUserProjects, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
    .then(function (j) {
        //Message for no Projects to Display
        if(j.length == 0){
            document.getElementById("no_project").style.display = "inline-block";
        }

        //Loop to display all projects in cards
        for (var i = 0; i < j.length; i++) {
            
            //Check status
            if(j[i].Progress_Status == "OnGoing"){

                var status = document.createElement("div");
                status.classList.add('text-sm','font-weight-normal','text-green', 'text-uppercase', 'mb-1','float-right');
                status.innerHTML = "On Going";

            }else if(j[i].Progress_Status == "OnHold"){

                var status = document.createElement("div");
                status.classList.add('text-sm','font-weight-normal','text-yellow', 'text-uppercase', 'mb-1','float-right');
                status.innerHTML = "On Hold";

            }else if(j[i].Progress_Status == "Completed"){

                var status = document.createElement("div");
                status.classList.add('text-sm','font-weight-normal','text-green', 'text-uppercase', 'mb-1','float-right');
                status.innerHTML = "Completed";

            }else if(j[i].Progress_Status == "Cancelled"){

                var status = document.createElement("div");
                status.classList.add('text-sm','font-weight-normal','text-red', 'text-uppercase', 'mb-1','float-right');
                status.innerHTML = "Cancelled";

            }

            //Get container to put elements in
            var container = document.getElementById("container");

            //Create elements
            var a = document.createElement('div');
            a.classList.add('col-xl-5', 'col-sm-6', 'mb-4', 'mt-3');

            var card = document.createElement("a");
            card.classList.add('card', 'border-left-primary','shadow','o-hidden', 'h-100', 'py-2');
            card.href = "view_project.html?" + j[i].ProjectID;

            var cardbody = document.createElement("div");
            cardbody.classList.add('card-body');

            var col1 = document.createElement("div");
            cardbody.classList.add('col','mr-2');

            var header = document.createElement("div");
            header.classList.add('text-xlg','font-weight-bold','text-primary', 'text-uppercase', 'mb-1');
            header.innerHTML = j[i].Name;

            var paragraph = document.createElement("div");
            paragraph.classList.add('text-sm','h5','mb-0', 'font-weight-bold', 'text-gray-800','text-truncate');
            paragraph.innerHTML = j[i].Description;

            var col2 = document.createElement("div");
            cardbody.classList.add('col-auto');

            var icon = document.createElement("i");
            icon.classList.add('fas','fa-calendar','fa-2x', 'text-gray-300');

            var progressHeader = document.createElement("h4");
            progressHeader.classList.add('small','font-weight-bold','mt-1');
            progressHeader.innerHTML = '&nbsp';

            var progressPercnetage = document.createElement("span");
            progressPercnetage.classList.add('float-right');
            progressPercnetage.innerHTML = j[i].Percentage + "%";

            var progressBarDiv = document.createElement("div");
            progressBarDiv.classList.add('progress');

            var progressBar = document.createElement("div");
            progressBar.classList.add('progress-bar-stripe','bg-success');
            progressBar.setAttribute("role", "progressbar");
            progressBar.setAttribute("style", "width:" + j[i].Percentage + "%");

            //Check project and flag if critical
            if(j[i].Critical_flag == true){

                card.classList.add('blink');
                var status = document.createElement("div");
                status.classList.add('text-sm','font-weight-bold','font-weight-normal','text-danger', 'text-uppercase', 'mb-1','float-right');
                status.innerHTML = "CRITICAL !";

            }

            //Appending the elements
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
            container.append(a);

        }

        //Remove loading icon on success and return Container to display normal output
        document.getElementById("load").style.display = "none";
        document.getElementById("container").style.display = "";

    }).catch(error => { console.error('Error:', error); return error; });

});