function edit_user() {
  //Urls
  var urlEditUserMains = urlMain + "api/UserMains/";

  //Get html containers
  var id = document.getElementById("id").value;
  var userName = document.getElementById("userName").value;
  var role = document.getElementById("role").value;
  var prev_role = document.getElementById("prev_role").value;
  var department = document.getElementById("department").value;
  var email = document.getElementById("email").value;
  var status = document.getElementById("status").value;

  //Check PM Role To place Projects on hold
  if (prev_role == "Project Manager" && role != "Project Manager") {
    confirm(
      "Role changed from project manager, this user will be removed from the following projects and will all be placed on hold."
    );
  } else if (status == false && role == "Project Manager") {
    confirm(
      "status changed from active to inactive, this user will be removed from the following projects and will all be placed on hold."
    );
  }

  $("#editModal").modal("hide");
  Swal.fire({
    title: "Please wait...",
    customClass: "swal-load",
    allowOutsideClick: false
  });
  Swal.showLoading();

  //making payload
  var payload_usermains = {
    ID: id,
    Username: userName,
    Department: department,
    Email: email,
    Status: status,
    Role: role
  };

  //Upload to user Main table if registered
  fetch(urlEditUserMains + id, {
    async: false,
    method: "PUT",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(payload_usermains)
  })
    .then(function(a) {
      Swal.fire({
        title: "Success!",
        text: "User Successfully Edited",
        type: "success",
        allowOutsideClick: false,
        confirmButtonText: "Ok"
      }).then(() => {
        window.location.assign("edit_user.html");
      });
    })
    .catch(error => {
      console.log("TCL: functionedit_user -> error", error);

      Swal.fire({
        title: "Error!",
        text: error,
        type: "error",
        allowOutsideClick: false,
        confirmButtonText: "Ok"
      });
    });

  //Set session var to refresh page
  sessionStorage.setItem("edit_clicked", false);
}
