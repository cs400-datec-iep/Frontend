/*////////////////////////////////////

Function to change user password

*/ ////////////////////////////////////
function editPassword() {
  //Urls
  urlPostPasswordChange = urlMain + "api/Account/ChangePassword";

  // Get data from modal
  var oldpassword = document.getElementById("oldpassword").value;
  var password = document.getElementById("password").value;
  var confirmPassword = document.getElementById("passwordConfirm").value;

  //Password Validation
  if (password == "" || oldpassword == "" || confirmPassword == "") {
    Swal.fire({
      title: "Empty Fields!",
      text: "Please fill all fields",
      type: "warning",
      confirmButtonText: "Ok"
    });
  } else if (password != confirmPassword) {
    Swal.fire({
      title: "Passwords Dont Match!",
      text: "Your passwords do not match",
      type: "warning",
      allowOutsideClick: false,
      confirmButtonText: "Ok"
    });
  } else {
    //Data encapsulation
    var payload_password = {
      OldPassword: oldpassword,
      NewPassword: password,
      ConfirmPassword: confirmPassword
    };

    //Change password
    fetch(urlPostPasswordChange, {
      async: false,
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(payload_password)
    })
      .then(function(a) {
        Swal.fire({
          title: "Success!",
          text: "Your password has been successfully changed",
          type: "success",
          allowOutsideClick: false,
          confirmButtonText: "Ok"
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
