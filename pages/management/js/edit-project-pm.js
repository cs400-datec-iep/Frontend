/*////////////////////////////////////

Function to change PM view to staff

*/ ////////////////////////////////////
function changeProjectPM() {
  //Get ID from url
  var url = window.location.href;
  var projectID = url.substring(url.lastIndexOf("?") + 1);

  //Urls
  var urlUpdateProj = urlMain + "api/Projects/" + projectID;

  //Variables
  var proj_mang_ID = sessionStorage.getItem("selectedPmId");
  var Project = JSON.parse(sessionStorage.getItem("ProjectDetails"));

  //Check if null
  if (proj_mang_ID.length == 0) {
    Swal.fire({
      title: "No Project Manager",
      text: "You have not selected a project manager, please select one",
      type: "warning",
      allowOutsideClick: false,
      confirmButtonText: "Ok"
    });
  } else {
    $("#changePMModal").modal("hide");
    //Loading modal
    Swal.fire({
      title: "Please wait...",
      customClass: "swal-load",
      allowOutsideClick: false
    });
    Swal.showLoading();

    var payload_project = {
      ProjectID: projectID,
      Name: Project.Name,
      Description: Project.Description,
      Start_Date: Project.Start_Date,
      Project_managerID: proj_mang_ID,
      number_of_days: Project.number_of_days,
      End_Date: Project.End_Date,
      Client_Name: Project.Client_Name,
      Expected_Date: Project.Expected_Date,
      Progress_Status: "OnGoing",
      Percentage: Project.Percentage,
      Status: true,
      Critical_flag: Project.Critical_flag,
      amount_billed: Project.amount_billed,
      amount_cost: Project.amount_cost
    };

    // Edit Project Details
    fetch(urlUpdateProj, {
      async: false,
      method: "PUT",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(payload_project)
    })
      .then(function(a) {
        Swal.fire({
          title: "Success!",
          text: "Reassigned project manager to: " + Project.Name,
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
}
