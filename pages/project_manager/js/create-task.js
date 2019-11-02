/*////////////////////////////////////

Function to create a task

*/ ////////////////////////////////////
function createTask() {
  //Urls
  var urlPostTask = urlMain + "api/Tasks";

  //Get html values
  var taskName = document.getElementById("taskName").value;
  var IfMilestone = document.getElementById("IfMilestone").checked;
  var taskDuration = document.getElementById("taskDuration").value;
  var taskDesc = document.getElementById("taskDesc").value;

  if (userIdList.length == 0 && IfMilestone == false) {
    Swal.fire({
      title: "Task Not Assigned",
      text: "You must assign the task to someone!",
      type: "warning",
      allowOutsideClick: false,
      confirmButtonText: "Ok"
    });
  } else {
    $("#createTaskModal").modal("hide");
    //Loading modal
    Swal.fire({
      title: "Creating your task. Please wait...",
      customClass: "swal-load",
      allowOutsideClick: false
    });
    Swal.showLoading();
    //Setup start date for task
    var current_date = new Date();
    var Start = new Date();
    var end_date = "",
      count = 0;
    while (count < taskDuration) {
      end_date = new Date(Start.setDate(Start.getDate() + 1));
      if (end_date.getDay() != 0 && end_date.getDay() != 6) {
        count++;
      }
    }

    // Data encapsulation based on type
    if (IfMilestone == true) {
      //Is a milestone
      var payload_task = {
        UserID: null,
        ProjectID: sessionStorage.getItem("ProjectID"),
        Name: taskName,
        Description: taskDesc,
        Date_Created: current_date,
        Expected_Date: null,
        Start_Date: null,
        End_Date: null,
        Status: true,
        If_Milestone: true,
        If_Objective: false,
        PredecessorTaskID: 0,
        Number_of_days: 0,
        Percentage: 0,
        Progress_Status: "Todo",
        Critical_flag: false
      };
    } else if (IfMilestone == false) {
      //Is a task
      var payload_task = {
        UserID: userIdList[0],
        ProjectID: sessionStorage.getItem("ProjectID"),
        Name: taskName,
        Description: taskDesc,
        Date_Created: current_date,
        Expected_Date: end_date,
        Start_Date: null,
        End_Date: null,
        Status: true,
        If_Milestone: false,
        If_Objective: false,
        PredecessorTaskID: selected_tasks_array[0],
        Number_of_days: taskDuration,
        Percentage: 0,
        Progress_Status: "Todo",
        Critical_flag: false
      };
    }

    // // //Creates a task to the database
    fetch(urlPostTask, {
      async: false,
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(payload_task)
    })
      .then(a => {
        localStorage.setItem("created_project", "true");
        Swal.fire({
          title: "Success!",
          text: "Task has been created, the page will now refresh.",
          type: "success",
          allowOutsideClick: false,
          confirmButtonText: "Ok"
        }).then(() => {
          window.location.assign(
            "task_view.html?" + sessionStorage.getItem("ProjectID")
          );
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
  }
}
