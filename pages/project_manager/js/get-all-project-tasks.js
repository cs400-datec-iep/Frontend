/*////////////////////////////////////

Function to get all tasks and initialize the task view page

*/ ////////////////////////////////////
$(document).ready(function() {
  // Urls
  var urlGetTask =
    urlMain + "api/GetTasksPerProject/" + sessionStorage.getItem("ProjectID");
  var urlGetProjectTeam =
    urlMain + "api/GetMembersProjectID/" + sessionStorage.getItem("ProjectID");

  //Loading modal
  Swal.fire({
    title: "Please wait...",
    customClass: "swal-load",
    allowOutsideClick: false
  });
  Swal.showLoading();

  //Set Task_view link
  document.getElementById("task_view_side_link").href = window.location.href;

  // Initialize Dropdown For Members
  $("#members_list").dropdown({
    onChange: function(value) {
      userIdList.push(value);
    }
  });

  // Initialize Dropdown For Predecessors
  $("#taskPredecesor").dropdown({
    placeholder: "Please Select Task Predecesors:",
    onChange: function(value) {
      selected_tasks_array.push(value);
    }
  });

  //Place project name into document variables
  document.getElementById(
    "project_name_side"
  ).innerHTML = sessionStorage.getItem("ProjectName");

  //Making Breadcrumb link
  var a = document.createElement("a");
  a.setAttribute(
    "href",
    "view_project.html?" + sessionStorage.getItem("ProjectID")
  );
  a.innerHTML = sessionStorage.getItem("ProjectName");
  document.getElementById("project_name_crumb").appendChild(a);

  // Setting links with project ID
  document
    .getElementById("view_project_link")
    .setAttribute(
      "href",
      "view_project.html?" + sessionStorage.getItem("ProjectID")
    );
  document.getElementById("page_title").innerHTML = sessionStorage.getItem(
    "ProjectName"
  );

  fetch(urlGetTask, {
    async: false,
    method: "GET",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  })
    .then(response => response.json())
    .then(a => {
      fetch(urlGetProjectTeam, {
        async: false,
        method: "GET",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token
        }
      })
        .then(response => response.json())
        .then(result => {
          //Dataset array
          var dataset = [];
          tasks_array = JSON.stringify(a);

          a.forEach(element => {
            //Parsing date into correct format
            if (element.Start_Date === null) {
              var datestart = "Not Started";
            } else {
              var datestart = new Date(element.Start_Date);
              datestart = moment(datestart).format("DD-MMM-YYYY");
            }

            //Populate task predecessor
            $("#taskPredecesor").append(
              $("<option>", {
                value: element.TaskID,
                text: element.Name
              })
            );

            var type = "";
            var critical, predecessor;

            // Check task type (Prepare array for datatable)
            if (
              element.If_Milestone === false &&
              element.If_Objective === false
            ) {
              //Task
              type = "Task";
            } else if (
              element.If_Milestone === true &&
              element.If_Objective === false
            ) {
              //Milestone
              type = "Milestone";
            } else if (
              element.If_Milestone === false &&
              element.If_Objective === true
            ) {
              //Objective
              type = "Objective";
            }

            if (element.Critical_flag === true) {
              //Checking critical status
              critical = element.Critical_flag;
            } else if (element.Critical_flag === false) {
              critical = element.Critical_flag;
            }

            if (element.PredecessorTaskID === 0) {
              //Checking critical status
              predecessor = "None";
            } else {
              predecessor = element.PredecessorTaskID;
            }

            //Check if assigned to, if so display the name
            var assign_to = "None";
            result.forEach(currentItem => {
              if (element.UserID == currentItem.ID) {
                assign_to = currentItem.Username;
              }
            });

            var dataObj = {
              TaskID: element.TaskID,
              Type: type,
              Name: element.Name,
              Start_Date: datestart,
              Status: element.Progress_Status,
              Duration: element.Number_of_days,
              Critical: critical,
              Predecessor: predecessor,
              Assigned: assign_to
            };
            dataset.push(dataObj);
          });

          //Initialize datatable
          table = $("#taskTable").DataTable({
            data: dataset,
            dom:
              "<'row'<'col-sm-3'l><'col-sm-6'f><'col-sm-3'<'text-center'B>>>" +
              "<'row'<'col-sm-12'tr>>" +
              "<'row'<'col-sm-6'i><'col-sm-6'p>>",
            buttons: ["excelHtml5", "pdf"],
            select: true,
            columns: [
              { data: "TaskID" },
              { data: "Type" },
              { data: "Name" },
              { data: "Start_Date" },
              { data: "Status" },
              { data: "Duration" },
              { data: "Critical" },
              { data: "Predecessor" },
              { data: "Assigned" }
            ],
            columnDefs: [
              {
                targets: [6],
                visible: false,
                searchable: false
              }
            ],
            createdRow: function(row, data) {
              if (data.Critical == true) {
                $(row).addClass("bg-danger text-white");
              }
            }
          });

          //Allow view tasks if records > 0
          var records = (totalDisplayRecord = $("#taskTable")
            .DataTable()
            .page.info().recordsDisplay);

          if (records > 0) {
            //View task details
            $("#taskTable tbody").on("click", "tr", function() {
              sessionStorage.setItem("task_array", tasks_array);
              window.location.assign(
                "view_task_details.html?" + table.row(this).data().TaskID
              );
            });
          } else {
            document
              .getElementById("taskTableContainer")
              .classList.toggle("d-none");
            document.getElementById("no_tasksTable").classList.toggle("d-none");
          }

          //Remove loading icon and display output
          document.getElementById("container").classList.remove("display-none");

          //Remove loading icon and display output for sidebar
          document
            .getElementById("icon_container")
            .classList.remove("display-none");
          document
            .getElementById("sidebarToggle")
            .classList.remove("display-none");

          Swal.close();
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
