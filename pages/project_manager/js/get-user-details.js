/*////////////////////////////////////

Get basic user info and display it

*/ ////////////////////////////////////
$(document).ready(function() {
  //Urls
  var urlGetUserInfo = urlMain + "api/UserMains/";

  //Fetch User Details
  fetch(urlGetUserInfo + sessionStorage.getItem("userID"), {
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
      //Set data
      document.getElementById("user_name").innerHTML = j.Username;
      document.getElementById("user_email").innerHTML = j.Email;
      document.getElementById("user_role").innerHTML = j.Role;
      document.getElementById("user_dept").innerHTML = j.Department;

      //Removing loading icon and display output
      document.getElementById("load").style.display = "none";
      document.getElementById("container").classList.remove("display-none");
    })
    .catch(error => console.error("Error:", error));
});
