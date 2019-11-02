/*////////////////////////////////////

Function to edit task in kanban (Percentage only)

*/ ////////////////////////////////////
function editTask() {
  //Url
  var urlEditTaskPercentage = urlMain + "api/UpdateTasksPercentage/";

  //Loading modal
  Swal.fire({
    title: "Applying changes...",
    customClass: "swal-load",
    allowOutsideClick: false
  });
  Swal.showLoading();

  //Get ID from url
  var url = window.location.href;
  var projectID = url.substring(url.lastIndexOf("?") + 1);

  var taskID = sessionStorage.getItem("taskIdKanbanClicked");
  var percentage = document.getElementById("percentageRange").value;

  //Get project details
  fetch(urlEditTaskPercentage + taskID + "/" + percentage, {
    async: false,
    method: "POST",
    crossDomain: true,
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(function(a) {
      Swal.fire({
        title: "Success!",
        text:
          "Percentage changed successfully. Page will now refresh to execute changes.",
        type: "success",
        allowOutsideClick: false,
        confirmButtonText: "Ok"
      }).then(() => {
        window.location.assign("view_project.html?" + projectID);
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
