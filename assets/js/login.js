/*////////////////////////////////////

Function to login user

*/ ////////////////////////////////////
async function Login() {
  //Urls
  var urlUserAccountInfo = urlMain + "api/account/userinfo";
  var urlUserMains = urlMain + "api/UserMains/";

  //Get html containers
  document.getElementById("illus").style.display = "none";
  document.getElementById("load").style.display = "block";

  let token = await getToken();

  if (token == false) {
    document.getElementById("clickme").click();
  }

  if (token != false) {
    sessionStorage.setItem("token", token);

    fetch(urlUserAccountInfo, {
      async: false,
      method: "GET",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(function(a) {
        return a.json();
      })
      .then(function(j) {
        console.log("Token Authenticated");

        fetch(urlUserMains + j.UserID, {
          async: false,
          method: "GET",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          }
        })
          .then(function(a) {
            return a.json();
          })
          .then(function(j) {
            // Get Login Timestamp and store
            var loginTimestamp = new Date();

            //setting session variable
            sessionStorage.setItem(
              "verified",
              "User_Successfully_Authenticated"
            );
            sessionStorage.setItem("loginTimestamp", loginTimestamp);

            //Redirect Based on Roles and Status
            if (j.Status == true) {
              if (j.Role == "System Administrator") {
                localStorage.clear();
                sessionStorage.setItem("userID", j.ID);
                sessionStorage.setItem("email", j.Email);
                sessionStorage.setItem("username", j.Username);
                window.location.assign("../../pages/admin/dashboard.html");
              } else if (j.Role == "Management") {
                localStorage.clear();
                sessionStorage.setItem("userID", j.ID);
                sessionStorage.setItem("email", j.Email);
                sessionStorage.setItem("username", j.Username);
                window.location.assign("../../pages/management/dashboard.html");
              } else if (j.Role == "Project Manager") {
                localStorage.clear();
                sessionStorage.setItem("userID", j.ID);
                sessionStorage.setItem("email", j.Email);
                sessionStorage.setItem("username", j.Username);
                sessionStorage.setItem("is_project_manager", "true");
                window.location.assign(
                  "../../pages/project_manager/dashboard.html"
                );
              } else if (j.Role == "Staff") {
                localStorage.clear();
                sessionStorage.setItem("userID", j.ID);
                sessionStorage.setItem("email", j.Email);
                sessionStorage.setItem("username", j.Username);
                sessionStorage.setItem("is_project_manager", "false");
                window.location.assign("../../pages/staff/dashboard.html");
              } else {
                window.location.assign("error_404.html");
              }
            } else {
              window.location.assign("error_403.html");
            }
          })
          .catch(error => console.error("Error:", error));
      })
      .catch(error => console.error("Error:", error));
  }
}
