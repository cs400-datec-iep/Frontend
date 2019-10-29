/*////////////////////////////////////

Function to Display project details

*/ ////////////////////////////////////
$(document).ready(function() {
  //Get ID from url
  var url = window.location.href;
  var projectID = url.substring(url.lastIndexOf("?") + 1);

  //Urls
  var urlGetProjectByID = urlMain + "api/Projects/" + projectID;
  var urlGetProjectFiles = urlMain + "api/GetFilesProjectID/" + projectID;
  var urlGetProjectTeam = urlMain + "api/GetMembersProjectID/" + projectID;

  //Get project details
  fetch(urlGetProjectByID, {
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
      //Set Project Details for Smart reporting
      sessionStorage.setItem("ProjectDetails", JSON.stringify(j));
      console.log("j :", j);

      //Get html Containers
      var page_title = document.getElementById("page_title");
      var project_name = document.getElementById("project_name_title");
      var project_name_side = document.getElementById("project_name_side");
      var project_name_crumb = document.getElementById("project_name_crumb");
      var project_client = document.getElementById("project_client");
      var project_status = document.getElementById("project_status");
      var project_status_val;
      var startDate = document.getElementById("project_startDate");
      var endDate = document.getElementById("project_endDate");
      var expDate = document.getElementById("project_expDate");
      var project_desc = document.getElementById("project_desc");
      var project_percentage = document.getElementById(
        "project_percentage_text"
      );
      var progress_meter = document.getElementById("progress_meter");
      var project_duration = document.getElementById("project_duration");
      var project_billed = document.getElementById("project_billed");
      var project_cost = document.getElementById("project_cost");

      //Set up dates
      expDate.innerHTML = moment(j.Expected_Date).format("DD-MMM-YYYY");
      startDate.innerHTML = moment(j.Start_Date).format("DD-MMM-YYYY");

      if (j.endDate === null) {
        endDate.innerHTML = "Not Completed";
      } else {
        endDate.innerHTML = moment(j.endDate).format("DD-MMM-YYYY");
      }

      project_duration.innerHTML = j.number_of_days + " Days";

      //set project billing information
      project_cost.innerHTML = "$" + j.amount_cost;
      project_billed.innerHTML = "$" + j.amount_billed;

      //Display critical status
      var critical = document.createElement("p");
      critical.classList.add("text-center", "text-danger");
      critical.innerHTML = "! CRITICAL !";

      //Create edit button for project
      var button = document.createElement("button");
      button.classList.add(
        "btn",
        "btn-danger",
        "btn-block",
        "text-white",
        "float-right",
        "col-md-2",
        "mb-2"
      );
      button.setAttribute("data-toggle", "modal");
      button.setAttribute("data-target", "#editProjectModel");
      button.setAttribute("disabled-target", "true");
      button.setAttribute("id", "edit_button");
      button.innerHTML = "Edit Project";

      // Set session var for project name and project ID
      sessionStorage.setItem("ProjectName", j.Name);
      sessionStorage.setItem("ProjectID", j.ProjectID);

      //Set sidebar links to send project ID back and forth
      document
        .getElementById("task_view_link")
        .setAttribute("href", "task_view.html?" + j.ProjectID);

      //Appending data onto the html containers
      page_title.innerHTML = j.Name;
      project_name.innerHTML = j.Name;

      project_name.appendChild(button);
      project_name_side.innerHTML = j.Name;
      project_name_crumb.innerHTML = j.Name;

      project_desc.innerHTML = j.Description;
      project_client.innerHTML = j.Client_Name;

      progress_meter.setAttribute("Style", "width:" + j.Percentage + "%;");
      project_percentage.innerHTML = j.Percentage + "%";

      // Check critical project
      if (j.Critical_flag == true) {
        //Diplsay Critial Status
        var icon = document.createElement("i");
        icon.classList.add("fas", "fa-info-circle", "text-red", "ml-1");
        project_status.classList.add(
          "text-danger",
          "font-weight-bold",
          "text-blink"
        );
        project_status.innerHTML = "CRITICAL";
        project_status.appendChild(icon);
      } else {
        // Check Project status and display
        if (j.Progress_Status == "OnGoing") {
          var icon = document.createElement("i");
          icon.classList.add(
            "fas",
            "fa-chevron-circle-right",
            "text-blue",
            "ml-1"
          );
          project_status.value = "On Going";
          project_status.appendChild(icon);
          project_status_val = "OnGoing";
        } else if (j.Progress_Status == "OnHold") {
          var icon = document.createElement("i");
          icon.classList.add("fas", "fa-pause-circle", "text-yellow", "ml-1");
          project_status.innerHTML = "On Hold";
          project_status.appendChild(icon);
          project_status_val = "OnHold";
        } else if (j.Progress_Status == "Completed") {
          var icon = document.createElement("i");
          icon.classList.add("fas", "fa-check-circle", "text-green", "ml-1");
          project_status.innerHTML = "Completed";
          project_status.appendChild(icon);
          project_status_val = "Completed";
        } else if (j.Progress_Status == "Cancelled") {
          var icon = document.createElement("i");
          icon.classList.add("fas", "fa-times-circle", "text-red", "ml-1");
          project_status.innerHTML = "Cancelled";
          project_status.appendChild(icon);
          project_status_val = "Cancelled";
        }
      }

      //Get members related to project
      fetch(urlGetProjectTeam, {
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
        .then(function(k) {
          //Get html container
          var ul = document.getElementById("user_list");

          //Loop thorugh array of users and append them to the display list
          for (var i = 0; i < k.length; i++) {
            userIdList.push(k[i].ID);

            var li = document.createElement("li");
            var p = document.createElement("p");
            p.classList.add("text-info");
            p.innerHTML =
              k[i].Username +
              " - <div class='text-danger display-inline-block'>" +
              k[i].Department +
              "</div>";
            li.appendChild(p);
            ul.appendChild(li);
          }

          //Remove loading icon and display output
          document.getElementById("load").style.display = "none";
          document.getElementById("container").classList.remove("display-none");
        })
        .catch(error => {
          console.error("Error:", error);
          return error;
        });

      //Get files realted to project
      fetch(urlGetProjectFiles, {
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
        .then(function(k) {
          //Get html container
          var ul = document.getElementById("document_list");

          //Check if empty
          if (k.length == 0) {
            document
              .getElementById("document_list_container")
              .classList.toggle("d-none");
            document.getElementById("no_files").classList.toggle("d-none");
            document
              .getElementById("no_files")
              .classList.remove("text-gray-800");
          }

          //Loop thorugh array of users and append them to list
          for (var i = 0; i < k.length; i++) {
            //Storing files into array for edit modal use
            var files = {
              Name: k[i].Name,
              Directory: k[i].Directory,
              FileID: k[i].FileID,
              ProjectID: k[i].ProjectID
            };

            file_array.push(files);
            display_file_array.push(files);

            //Append project team members to html list container
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.innerHTML =
              "<a href='https://" + k[i].Directory + "'>" + k[i].Name + "</a>";
            li.appendChild(a);
            ul.appendChild(li);
          }
        })
        .catch(error => {
          console.error("Error:", error);
          return error;
        });

      //Remove loading icon and display output for sidebar
      document
        .getElementById("icon_container")
        .classList.remove("display-none");
      document.getElementById("sidebarToggle").classList.remove("display-none");

      //Load data into Edit project modal
      $("#edit_button").on("click", function() {
        //values that are edited
        document.getElementById("projName").value = j.Name;
        document.getElementById("projDesc").value = j.Description;
        document.getElementById("status").value = j.Status;
        document.getElementById("project_status").value = j.Progress_Status;
        document.getElementById("projBilled").value = j.amount_billed;
        document.getElementById("projCost").value = j.amount_cost;
        document.getElementById("projCost").value = j.amount_cost;
        document.getElementById("projBilled").value = j.amount_billed;
        document.getElementById(
          "edit_project_status"
        ).value = project_status_val;

        //values that cant be edited
        sessionStorage.setItem("project_duration", j.number_of_days);
        sessionStorage.setItem("project_client", j.Client_Name);
        sessionStorage.setItem("project_startDate", j.Start_Date);
        sessionStorage.setItem("project_endDate", j.End_Date);
        sessionStorage.setItem("project_expendDate", j.Expected_Date);
        sessionStorage.setItem("project_percentage", j.Percentage);
        sessionStorage.setItem("project_critical", j.Critical_flag);

        //Get html container
        var ul = document.getElementById("fileList");

        //Populate file list in edit modal
        function populateList() {
          $("#fileList").empty(); //Empty list from previous load

          //Loop through file array and display with hyperlinks
          for (var i = 0; i < file_array.length; i++) {
            var li = document.createElement("li");
            li.id = file_array[i].FileID; //Store for list item reference

            var p = document.createElement("p");
            p.innerHTML = file_array[i].Name;

            var btn = document.createElement("button");
            btn.classList.add(
              "btn-circle-edit",
              "btn-danger",
              "col-md-2",
              "ml-2"
            );
            btn.id = file_array[i].FileID;
            btn.innerHTML = "X";
            btn.setAttribute("type", "button");

            //Function which deletes file on edit view
            btn.onclick = function() {
              for (var j = 0; j < file_array.length; j++) {
                if (file_array[j].FileID == this.id) {
                  deleted_file_array.push(file_array[j].FileID);
                  file_array.splice(j, 1);
                  var elem = document.getElementById(this.id);
                  elem.parentNode.removeChild(elem);
                  populateList();
                }
              }
              populateList();
            };

            //Append elements
            p.appendChild(btn);
            li.appendChild(p);
            ul.appendChild(li);
          }
        }

        //Populate the list
        populateList();
      });
    })
    .catch(error => {
      console.error("Error:", error);
      return error;
    });
});
