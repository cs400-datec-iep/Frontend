/*////////////////////////////////////

Display tasks in datatable

*/ ////////////////////////////////////
$(document).ready(function() {
  //Get ID from url
  var url = window.location.href;
  var projectID = url.substring(url.lastIndexOf("?") + 1);

  //Urls
  var urlGetTask = urlMain + "api/GetTasksPerProject/" + projectID;
  var urlGetProjectTeam = urlMain + "api/GetMembersProjectID/" + projectID;

  var dataset = [];

  // Get user names to compare with userdID in task
  fetch(urlGetProjectTeam, {
    async: false,
    method: "GET",
    crossDomain: true,
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(result => result.json())
    .then(users => {
      //Get All tasks for list view
      fetch(urlGetTask, {
        async: false,
        method: "GET",
        crossDomain: true,
        headers: {
          Authorization: "Bearer " + token
        }
      })
        .then(response => response.json())
        .then(tasks => {
          //loop through tasks and user to match matching UserID's
          tasks.forEach(element => {
            //Parsing date into correct format
            if (element.Start_Date == null) {
              var datestart = "Has not started work";
            } else {
              var datestart = new Date(element.Start_Date);
              datestart = moment(datestart).format("DD-MMM-YYYY");
            }

            var datecreated = new Date(element.Date_Created);
            datecreated = moment(datecreated).format("DD-MMM-YYYY");

            var type = "";
            var critical, predecessor;

            // Check task type (Prepare array for datatable)
            if (
              element.If_Milestone === false &&
              element.If_Objective === false
            ) {
              //Task
              type = "Task";
            } else if (element.If_Milestone === true) {
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
            users.forEach(currentItem => {
              if (element.UserID == currentItem.ID) {
                assign_to = currentItem.Username;
              }
            });

            var dataObj = {
              TaskID: element.TaskID,
              Type: type,
              Name: element.Name,
              Created_Date: datecreated,
              Start_Date: datestart,
              Status: element.Progress_Status,
              Duration: element.Number_of_days,
              Critical: critical,
              Predecessor: predecessor,
              Assigned_To: assign_to
            };
            dataset.push(dataObj);
          });

          //Initialize datatable
          table = $("#taskTable").DataTable({
            dom:
              "<'row'<'col-sm-2'B><'col-sm-6'f><'col-sm-4'l>>" +
              "<'row'<'col-sm-12'tr>>" +
              "<'row'<'col-sm-6'i><'col-sm-6'p>>",
            buttons: ["excelHtml5", "pdf"],
            data: dataset,
            select: true,
            columns: [
              { data: "TaskID" },
              { data: "Type" },
              { data: "Name" },
              { data: "Created_Date" },
              { data: "Start_Date" },
              { data: "Status" },
              { data: "Duration" },
              { data: "Critical" },
              { data: "Predecessor" },
              { data: "Assigned_To" }
            ],
            columnDefs: [
              {
                targets: [7],
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
              //Create a button to open modal cause frankly modal.('show') doesnt work
              var btn = document.createElement("button");
              btn.id = "click";
              btn.setAttribute("data-toggle", "modal");
              btn.setAttribute("data-target", "#taskViewListModal");
              btn.setAttribute("hidden", "true");
              document.getElementById("container").appendChild(btn);
              $("#click").trigger("click");

              //Load data into modal
              tasks.forEach(value => {
                if (value.TaskID == table.row(this).data().TaskID) {
                  document.getElementById("taskNameList").innerHTML =
                    value.Name;
                  document.getElementById("taskStatusList").innerHTML =
                    value.Progress_Status;
                  document.getElementById("valueList").innerHTML =
                    value.Percentage + "%";
                  document
                    .getElementById("percentageRangeList")
                    .setAttribute("Style", "width:" + value.Percentage + "%;");
                  document.getElementById("taskPredList").innerHTML =
                    value.PredecessorTaskID;
                  document.getElementById("taskDurationList").innerHTML =
                    value.Number_of_days;
                  document.getElementById("taskDescList").innerHTML =
                    value.Description;
                }
              });
            });
          } else {
            document
              .getElementById("taskTableContainer")
              .classList.toggle("d-none");
            document.getElementById("no_tasksTable").classList.toggle("d-none");
          }
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
