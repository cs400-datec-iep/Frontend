$(document).ready(function () {

    var i;
    for (i = 0; i < 5; i++) {
    

        //creating project card
        var projectName = "Test"+i;
        var projectDesc = "Test";
        var projectPercentage = 39;

        //get container to put elements in
        var container = document.getElementById("container");

        //create elements
        var a = document.createElement('a');
        a.classList.add('col-xl-5', 'col-sm-6', 'mb-3', 'dash-card');
        a.onclick = function () { get_project_details(); };

        var card = document.createElement("div");
        card.classList.add('card', 'text-white', 'bg-dark-grey', 'o-hidden', 'h-100', 'proj-card');

        var cardbody = document.createElement("div");
        cardbody.classList.add('card-body');

        var header = document.createElement("h1");
        header.innerHTML = projectName;

        var paragraph = document.createElement("p");
        paragraph.innerHTML = projectDesc;

        var progressBarDiv = document.createElement("div");
        progressBarDiv.classList.add('progress');

        var progressBar = document.createElement("div");
        progressBar.classList.add('progress-bar');
        progressBar.setAttribute("role", "progressbar");
        progressBar.setAttribute("style", "width:" + projectPercentage + "%");
        progressBar.innerHTML = projectPercentage + "%";

        //Generating the elements
        a.appendChild(card);
        card.appendChild(cardbody);
        cardbody.appendChild(header);
        cardbody.appendChild(paragraph);
        cardbody.appendChild(progressBarDiv);
        progressBarDiv.appendChild(progressBar);

        //place generated elements into container  
        container.append(a);

    }
});