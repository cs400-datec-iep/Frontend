/*////////////////////////////////////

Function to edit task in kanban (Percentage only)

*/ ////////////////////////////////////
function editTask() {
  //Url
  var urlEditTaskPercentage = urlMain + "api/UpdateTasksPercentage/";

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
      alert(
        "Percentage changed successfully. Page will now refresh to execute changes."
      );
      window.location.assign("view_project.html?" + projectID);
    })
    .catch(error => {
      console.error("Error:", error);
      return error;
    });
}
