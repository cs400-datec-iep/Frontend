async function Login() {
  document.getElementById('illus').style.display = 'none';
  document.getElementById('load').style.display = 'block';

  let token = await getToken();
  var userID;
  console.log(token);
  url = 'https://datectestapi.azurewebsites.net/api/account/userinfo';
  if (token == false) {
    // alert("Incorrect Login Details");
    // window.location.replace("../../index.html");
    document.getElementById("clickme").click();
  }

  if (token != false) {
    sessionStorage.setItem("token", token);

    fetch(url, {
      async: false,
      method: 'GET',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }).then(function (a) { return a.json(); })
      .then(function (j) {
        console.log("Successful");
        userID = j.UserID;
        var url2 = 'https://datectestapi.azurewebsites.net/api/UserMains/' + userID;

        fetch(url2, {
          async: false,
          method: 'GET',
          crossDomain: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        })
          .then(function (a) { return a.json(); })
          .then(function (j) {

            sessionStorage.setItem("verified", "OKAY");
            //Redirect Based on Roles
            var role = j.Role;


            if (role == "System Admin") {
              sessionStorage.setItem("userID", j.ID);
              sessionStorage.setItem("username", j.Username);
              window.location.replace("../../pages/admin/dashboard.html");
            }


          }).catch(error => console.error('Error:', error));


      })
      .catch(error => console.error('Error:', error));
  }
}





