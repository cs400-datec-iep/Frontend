/*////////////////////////////////////

Session check scripts

*/ ////////////////////////////////////
var verified = sessionStorage.getItem("verified");
console.log(verified);

if (verified != "User_Successfully_Authenticated") {
  window.location.assign("../../index.html");
} else if (verified == "User_Successfully_Authenticated") {
  //Timestamp calculations
  var loginTimestamp = sessionStorage.getItem("loginTimestamp");
  const date = new Date(loginTimestamp);
  var sessionTimeoutTimestamp = moment(date.toISOString())
    .add(60, "m")
    .toDate();
  var currentTimestamp = new Date();
  var bool = false;

  //Checks session timeout every 2 seconds
  setInterval(function() {
    if (bool == true) {
      window.location.assign("../../index.html");
    } else if (currentTimestamp >= sessionTimeoutTimestamp) {
      alert(
        "Your session has expired. You will now be redirected to the login page"
      );
      bool = true;
      window.location.assign("../../index.html");
    }
  }, 2000);
}
