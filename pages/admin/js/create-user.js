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

  $("#loader_work").modal({
    backdrop: "static", //remove ability to close modal with click
    keyboard: false, //remove option to close with keyboard
    show: true //Display loader!
  });

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
        alert("That email already exists. Please enter a new email");
        $("#loader_work").modal("hide");
      } else {
        alert("User Successfully Created");
        window.location.assign("edit_user.html");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      window.location.reload;
      return error;
    });
}
