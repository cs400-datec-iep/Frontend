/*////////////////////////////////////

Function to create a user

*/ ////////////////////////////////////
function create_user() {
  //Urls
  var urlRegisterAccount = urlMain + "api/Account/Register";

  //Get html containers
  var userName = document.getElementById("userName").value;
  var role = document.getElementById("role").value;
  var department = document.getElementById("department").value;
  var email = document.getElementById("email").value;

  Swal.fire({
    title: "Please wait...",
    customClass: "swal-load",
    allowOutsideClick: false
  });
  Swal.showLoading();

  //data encapsulation
  var payload_usermains = {
    Username: userName,
    Department: department,
    Email: email,
    Role: role
  };

  //Register User into Database
  fetch(urlRegisterAccount, {
    async: false,
    method: "POST",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(payload_usermains)
  })
    .then(function(a) {
      if (a.status == 400) {
        Swal.fire({
          title: "Email Exists!",
          text: "The email entered already exists",
          type: "warning",
          allowOutsideClick: false,
          confirmButtonText: "Ok"
        });
      } else {
        Swal.fire({
          title: "Success!",
          text: "User has been created",
          type: "success",
          allowOutsideClick: false,
          confirmButtonText: "Ok"
        }).then(() => {
          window.location.assign("edit_user.html");
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
      }).then(() => {
        window.location.reload;
      });
    });
}
