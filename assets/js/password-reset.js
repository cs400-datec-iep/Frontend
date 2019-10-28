/*////////////////////////////////////

Function to reset password 

*/ ////////////////////////////////////
function passwordReset() {
  //Urls
  var urlPostEmail = urlMain + "api/Account/ForgotPassword";
  var urlResetPage = window.location.origin + "/forget_password.html";

  //Get html value
  var email = document.getElementById("email").value;

  //Data encapsulation
  var payload_forgotPass = {
    Email: email,
    myURL: urlResetPage
  };

  fetch(urlPostEmail, {
    async: true,
    method: "POST",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload_forgotPass)
  }).catch(error => {
    console.error("Error:", error);
    return error;
  });

  //Display message as email sends
  document.getElementById("confirmation_message").classList.remove("d-none");
}
