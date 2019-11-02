/*////////////////////////////////////

Function to Display task details

*/ ////////////////////////////////////
$(document).ready(function() {
  //Get ID from url
  var url = window.location.href;
  var taskID = url.substring(url.lastIndexOf("?") + 1);

  //Urls
  var urlGetTaskDetails = urlMain + "api/Tasks/" + taskID;
  var urlGetProjectTeam =
    urlMain + "api/GetMembersProjectID/" + sessionStorage.getItem("ProjectID");

  //Set Task_view link
  document.getElementById("task_view_side_link").href =
    "task_view.html?" + sessionStorage.getItem("ProjectID");

  //Loacal Variables
  var task_type;

  //Loading modal
  Swal.fire({
    title: "Loading details...",
    customClass: "swal-load",
    allowOutsideClick: false
  });
  Swal.showLoading();

  // Get task details
  fetch(urlGetTaskDetails, {
    async: false,
    method: "GET",
    crossDomain: true,
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(response => response.json())
    .then(a => {
      // Get Users for dropdown and get user for task
      fetch(urlGetProjectTeam, {
        async: false,
        method: "GET",
        crossDomain: true,
        headers: {
          Authorization: "Bearer " + token
        }
      })
        .then(response => response.json())
        .then(j => {
          //Linking data result to html containers
          document.getElementById(
            "project_name_side"
          ).innerHTML = sessionStorage.getItem("ProjectName");

          //Making Breadcrumb links
          var link = document.createElement("a");
          link.setAttribute(
            "href",
            "view_project.html?" + sessionStorage.getItem("ProjectID")
          );
          link.innerHTML = sessionStorage.getItem("ProjectName");
          document.getElementById("project_name_crumb").appendChild(link);

          var link2 = document.createElement("a");
          link2.setAttribute(
            "href",
            "task_view.html?" + sessionStorage.getItem("ProjectID")
          );
          link2.innerHTML = "Task View";
          document.getElementById("task_view_crumb").appendChild(link2);

          document.getElementById("task_name_crumb").innerHTML = a.Name;

          // Check task type
          if (a.If_Milestone === false && a.If_Objective === false) {
            task_type = "task";
          } else if (a.If_Milestone === true) {
            task_type = "milestone";
            $("#taskDuration_Container").toggleClass("d-none");
            $("#taskPredecesor_Container").toggleClass("d-none");
            $("#members_list_Container").toggleClass("d-none");
          } else if (a.If_Objective === true) {
            task_type = "objective";
          }

          document.getElementById("task_name_title").innerHTML = a.Name;

          //Set Dropdown values for members
          if (a.UserID == null) {
            document.getElementById("task_assigned_to").innerHTML = "None";
          } else {
            j.forEach(element => {
              if (a.UserID === element.ID) {
                document.getElementById("task_assigned_to").innerHTML =
                  element.Username;
                $("#members_list").append(
                  $("<option>", {
                    value: element.ID,
                    text: element.Username,
                    selected: true
                  })
                );
              } else {
                $("#members_list").append(
                  $("<option>", {
                    value: element.ID,
                    text: element.Username
                  })
                );
              }
            });
          }

          // Check status and critical
          if (a.Critical_flag == true) {
            document.getElementById("task_status").innerHTML = "Critical";
          } else {
            // Check Project status and display
            if (a.Progress_Status == "Todo") {
              document.getElementById("task_status").innerHTML = "To Do";
            } else if (a.Progress_Status == "Doing") {
              document.getElementById("task_status").innerHTML = "Doing";
            } else if (a.Progress_Status == "Done") {
              document.getElementById("task_status").innerHTML = "Done";
            }
          }

          //Parsing dates into correct format
          //Start Date
          if (a.Start_Date === null) {
            document.getElementById("task_start").innerHTML = "Not Started";
          } else {
            var datecreated = moment(a.Date_Created).format("DD-MMM-YYYY");
            document.getElementById("task_start").innerHTML = datecreated;
          }

          //End Date
          if (a.End_Date === null) {
            document.getElementById("task_end_date").innerHTML =
              "Not Completed";
          } else {
            var dateend = moment(a.End_Date).format("DD-MMM-YYYY");
            document.getElementById("task_end_date").innerHTML = dateend;
          }

          //Expecetd End Date
          if (a.Expected_Date === null) {
            document.getElementById("task_expected").innerHTML =
              "Not Completed";
          } else {
            var dateexp = moment(a.Expected_Date).format("DD-MMM-YYYY");
            document.getElementById("task_expected").innerHTML = dateexp;
          }

          var datecreated = moment(a.Date_Created).format("DD-MMM-YYYY");
          document.getElementById("task_Created_date").innerHTML = datecreated;

          document.getElementById("task_duration").innerHTML = a.Number_of_days;
          document
            .getElementById("progress_meter")
            .setAttribute("Style", "width:" + a.Percentage + "%;");
          document.getElementById("task_percentage").innerHTML =
            a.Percentage + "%";
          document.getElementById("task_desc").innerHTML = a.Description;
          document.getElementById("task_type").innerHTML =
            "<b>Type:</b> " + task_type;

          //Get task array from previous page
          var task_array = JSON.parse(sessionStorage.getItem("task_array"));

          //Setup range slider for percentage
          document.getElementById("value").innerHTML = a.Percentage + "%";
          document.getElementById("percentageRange").value = a.Percentage;

          // Setting links with project ID
          document
            .getElementById("view_project_link")
            .setAttribute(
              "href",
              "view_project.html?" + sessionStorage.getItem("ProjectID")
            );
          document.getElementById(
            "page_title"
          ).innerHTML = sessionStorage.getItem("ProjectName");

          //Create edit button for task
          var button = document.createElement("button");
          button.classList.add(
            "btn",
            "btn-danger",
            "btn-block",
            "text-white",
            "float-right",
            "col-md-2"
          );
          button.setAttribute("data-toggle", "modal");
          button.setAttribute("data-target", "#editTaskModal");
          button.setAttribute("disabled-target", "true");
          button.setAttribute("id", "edit_button");
          button.onclick = function() {
            //Set edit modal input fields
            document.getElementById("taskName").value = a.Name;
            document.getElementById("taskStatus").value = a.Progress_Status;
            document.getElementById("status").value = a.Status;
            document.getElementById("project_critical").value = a.Critical_flag;
            document.getElementById("taskType").value = task_type;
            document.getElementById("taskDuration").value = a.Number_of_days;
            document.getElementById("taskDesc").value = a.Description;
            document.getElementById("taskPredecesor").value =
              a.PredecessorTaskID;

            //Set task ID and dates as session
            sessionStorage.setItem("taskID", a.TaskID);
            sessionStorage.setItem("startDate", a.Start_Date);
            sessionStorage.setItem("endDate", a.End_Date);
            sessionStorage.setItem("expDate", a.Expected_Date);
            sessionStorage.setItem("createdDate", a.Date_Created);
          };
          button.innerHTML = "Edit Task";

          task_name_title.appendChild(button);

          //Remove loading icon and display output
          document.getElementById("container").classList.remove("display-none");
          Swal.close();

          //Remove loading icon and display output for sidebar
          document
            .getElementById("icon_container")
            .classList.remove("display-none");
          document
            .getElementById("sidebarToggle")
            .classList.remove("display-none");
        })
        .catch(error => {
          Swal.fire({
            title: "Error!",
            text: error,
            type: "error",
            allowOutsideClick: false,
            confirmButtonText: "Ok"
          });
        });
    })
    .catch(error => {
      Swal.fire({
        title: "Error!",
        text: error,
        type: "error",
        allowOutsideClick: false,
        confirmButtonText: "Ok"
      });
    });
});
