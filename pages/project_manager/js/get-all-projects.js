/*////////////////////////////////////

Function to get and display all projects for PM

*/ ////////////////////////////////////
$(document).ready(function() {
  //Urls
  var urlGetUserProjects = urlMain + "api/GetProjectsForPM/";

  //Get projects based on manager id
  fetch(urlGetUserProjects + sessionStorage.getItem("userID"), {
    async: false,
    method: "GET",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  })
    .then(function(a) {
      return a.json();
    })
    .then(function(j) {
      var counter = 0;

      //Remove loading icon on success
      document.getElementById("load").style.display = "none";

      //Message for no Projects to Display
      if (j.length == 0) {
        document.getElementById("no_project").style.display = "inline-block";
        document.getElementById("container").classList.toggle("d-none");
      }

      //Loop to display all projects
      for (var i = 0; i < j.length; i++) {
        if (j[i].Status == true) {
          //Counter for completed projects
          if (j[i].Progress_Status == "Completed") {
            counter++;
          }

          //Creating project card
          var projectName = j[i].Name;
          var projectDesc = j[i].Description;
          var projectID = j[i].ProjectID;
          var projectPercentage = j[i].Percentage;
          var projectSatus = j[i].Progress_Status;
          var projectCritical = j[i].Critical_flag;

          //Check status
          if (projectSatus == "OnGoing") {
            var status = document.createElement("div");
            status.classList.add(
              "text-sm",
              "font-weight-normal",
              "text-green",
              "text-uppercase",
              "mb-1",
              "float-right"
            );
            status.innerHTML = "On Going";
          } else if (projectSatus == "OnHold") {
            var status = document.createElement("div");
            status.classList.add(
              "text-sm",
              "font-weight-normal",
              "text-yellow",
              "text-uppercase",
              "mb-1",
              "float-right"
            );
            status.innerHTML = "On Hold";
          } else if (projectSatus == "Completed") {
            var status = document.createElement("div");
            status.classList.add(
              "text-sm",
              "font-weight-normal",
              "text-green",
              "text-uppercase",
              "mb-1",
              "float-right"
            );
            status.innerHTML = "Completed";
          } else if (projectSatus == "Cancelled") {
            var status = document.createElement("div");
            status.classList.add(
              "text-sm",
              "font-weight-normal",
              "text-red",
              "text-uppercase",
              "mb-1",
              "float-right"
            );
            status.innerHTML = "Cancelled";
          }

          //Containers
          var container = document.getElementById("row1");
          var container2 = document.getElementById("row2");

          //Create elements
          var a = document.createElement("div");
          a.classList.add("col-xl-5", "col-sm-6", "mb-4", "mt-3");

          var card = document.createElement("a");
          card.classList.add(
            "card",
            "border-left-primary",
            "shadow",
            "o-hidden",
            "h-100",
            "py-2"
          );
          card.href = "view_project.html?" + projectID;

          var cardbody = document.createElement("div");
          cardbody.classList.add("card-body");

          var col1 = document.createElement("div");
          cardbody.classList.add("col", "mr-2");

          var header = document.createElement("div");
          header.classList.add(
            "text-xlg",
            "font-weight-bold",
            "text-primary",
            "text-uppercase",
            "mb-1"
          );
          header.innerHTML = projectName;

          var paragraph = document.createElement("div");
          paragraph.classList.add(
            "text-sm",
            "h5",
            "mb-0",
            "font-weight-bold",
            "text-gray-800",
            "text-truncate"
          );
          paragraph.innerHTML = projectDesc;

          var col2 = document.createElement("div");
          cardbody.classList.add("col-auto");

          var icon = document.createElement("i");
          icon.classList.add("fas", "fa-calendar", "fa-2x", "text-gray-300");

          var progressHeader = document.createElement("h4");
          progressHeader.classList.add("small", "font-weight-bold", "mt-1");
          progressHeader.innerHTML = "&nbsp";

          var progressPercnetage = document.createElement("span");
          progressPercnetage.classList.add("float-right");
          progressPercnetage.innerHTML = projectPercentage + "%";

          var progressBarDiv = document.createElement("div");
          progressBarDiv.classList.add("progress");

          var progressBar = document.createElement("div");
          progressBar.classList.add("progress-bar-stripe", "bg-success");
          progressBar.setAttribute("role", "progressbar");
          progressBar.setAttribute("style", "width:" + projectPercentage + "%");

          // Check project critical flag
          if (projectCritical == true) {
            card.classList.add("blink");
            var status = document.createElement("div");
            status.classList.add(
              "text-sm",
              "font-weight-bold",
              "font-weight-normal",
              "text-danger",
              "text-uppercase",
              "mb-1",
              "float-right"
            );
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

          //Place generated elements into proper containers
          if (j[i].Progress_Status == " Completed") {
            container2.append(a);
          } else {
            container.append(a);
          }

          //Display no completed projects
          if (counter == 0) {
            document.getElementById("no_completed_project").style.display =
              "inline-block";
          }
        }
      }

      //Return Container to display normal output
      document.getElementById("container").classList.toggle("d-none");
    })
    .catch(error => {
      console.error("Error:", error);
      return error;
    });
});
