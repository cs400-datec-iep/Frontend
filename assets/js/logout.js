/*////////////////////////////////////

Function to logout user

*/ ////////////////////////////////////
function logout() {
  var script = document.createElement("script");
  script.src = "global-variables.js";

  //Url
  var UrlLogout = urlMain + "api/Logs";

  $("#logoutModal").modal("hide");
  //Loggin out modal
  var btn = document.createElement("button");
  btn.id = "click";
  btn.setAttribute("data-toggle", "modal");
  btn.setAttribute("data-target", "#logging_out_loader");
  btn.setAttribute("hidden", "true");
  document.getElementById("wrapper").appendChild(btn);
  $("#click").trigger("click");

  //Payload
  var payload_logout = {
    UserID: sessionStorage.getItem("email"),
    Event_Type: "User Logout",
    Event_Description: "User logged out",
    Trigger: "Front End - logout() function",
    Module: "Sign In",
    ProjectID: 0,
    TimeStamp: new Date(),
    Viewed: false,
    Assignedto: null
  };

  //Logs logout into database
  fetch(UrlLogout, {
    async: false,
    method: "POST",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(payload_logout)
  }).then(function(a) {
    sessionStorage.clear();
    localStorage.clear();
    window.location.assign("../../index.html");
  });
}
