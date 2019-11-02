/*////////////////////////////////////

Function to create a project

*/ ////////////////////////////////////
function create_project() {
  //Urls
  urlPostProject = urlMain + "api/Projects";
  urlPostUserProject = urlMain + "api/UserProjects";
  urlPostFiles = urlMain + "api/Files";
  var urlFileUpload = urlMain + "api/FileUpload/";

  //Get html containers
  var projectName = document.getElementById("projName").value;
  var projClient = document.getElementById("projClient").value;
  var projDesc = document.getElementById("projDesc").value;
  var projStartDate = document.getElementById("projStartDate").value;
  var projDuration = document.getElementById("projDuration").value;
  var projCost = document.getElementById("projCost").value;
  var ProjectMangerId = sessionStorage.getItem("userID");

  //Calculate End date
  var Start = new Date(projStartDate);
  var projEndDate = "",
    count = 0;
  while (count < projDuration) {
    projEndDate = new Date(Start.setDate(Start.getDate() + 1));
    if (projEndDate.getDay() != 0 && projEndDate.getDay() != 6) {
      count++;
    }
  }

  //Loading modal
  Swal.fire({
    title: "Creating your project. Please Wait...",
    customClass: "swal-load",
    allowOutsideClick: false
  });
  Swal.showLoading();

  //Data encapsulation
  var payload_project = {
    Name: projectName,
    Description: projDesc,
    Start_Date: projStartDate,
    Project_managerID: ProjectMangerId,
    End_Date: null,
    number_of_days: projDuration,
    Client_Name: projClient,
    Expected_Date: projEndDate,
    Progress_Status: "OnGoing",
    Percentage: 0,
    Status: true,
    amount_billed: 0,
    amount_cost: projCost,
    Critical_flag: false
  };

  // Create project and returns ID of new project
  fetch(urlPostProject, {
    async: false,
    method: "POST",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(payload_project)
  })
    .then(function(a) {
      return a.json();
    })
    .then(function(j) {
      //Add Project Manager as a member
      userIdList.push(sessionStorage.getItem("userID"));

      //Loop for each user store project id and link users to project
      for (var i = 0; i < userIdList.length; i++) {
        //Data encapsulation
        var payload_user_project = {
          ProjectID: j.ProjectID,
          UserID: userIdList[i]
        };

        //Create Users in UserProject
        fetch(urlPostUserProject, {
          async: false,
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify(payload_user_project)
        }).catch(error => {
          Swal.fire({
            title: "Error!",
            text: error,
            type: "error",
            allowOutsideClick: false,
            confirmButtonText: "Ok"
          });
        });
      }

      //Link uploaded files to the project ID
      if (ArrayOfFiles.length > 0) {
        for (var i = 0; i < ArrayOfFiles.length; i++) {
          const formData = new FormData();
          formData.append("", ArrayOfFiles[i]);

          const options = {
            method: "POST",
            body: formData
            // If you add this, upload won't work
            // headers: {
            //   'Content-Type': 'multipart/form-data',
            // }
          };
          fetch(urlFileUpload + j.ProjectID, options).catch(error => {
            Swal.fire({
              title: "Error!",
              text: error,
              type: "error",
              allowOutsideClick: false,
              confirmButtonText: "Ok"
            });
          });
        }

        localStorage.setItem("created_project", "true");
        Swal.fire({
          title: "Success!",
          text: "Project created successfully",
          type: "success",
          allowOutsideClick: false,
          confirmButtonText: "Ok"
        }).then(() => {
          window.location.href = "dashboard.html";
        });
      } else {
        localStorage.setItem("created_project", "true");
        Swal.fire({
          title: "Success!",
          text: "Project created successfully",
          type: "success",
          allowOutsideClick: false,
          confirmButtonText: "Ok"
        }).then(() => {
          window.location.href = "dashboard.html";
        });
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
}
