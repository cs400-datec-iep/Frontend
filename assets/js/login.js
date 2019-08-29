async function Login() {
  document.getElementById('illus').style.display = 'none';
  document.getElementById('load').style.display = 'block';

  let token = await getToken();
  var userID;
  console.log(token);
  url = 'https://datectestapi.azurewebsites.net/api/account/userinfo';
  if (token == false) {
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
        }).then(function (a) { return a.json(); })
          .then(function (j) {
            //setting session variable
            sessionStorage.setItem("verified", "ACCESS_GRANTED");
            
            //Redirect Based on Roles and Status
            var role = j.Role;
            var status = j.Status
            if(status == true){
              if (role == "System Administrator") {

                sessionStorage.setItem("userID", j.ID);
                sessionStorage.setItem("username", j.Username);
                window.location.assign("../../pages/admin/dashboard.html");
  
              }else if(role == "Management"){
  
                sessionStorage.setItem("userID", j.ID);
                sessionStorage.setItem("username", j.Username);
                window.location.assign("../../pages/management/dashboard.html");
  
              }else if(role == "Project Manager"){
  
                sessionStorage.setItem("userID", j.ID);
                sessionStorage.setItem("username", j.Username);
                window.location.assign("../../pages/project_manager/dashboard.html");
  
              }else if(role == "Staff"){
  
                sessionStorage.setItem("userID", j.ID);
                sessionStorage.setItem("username", j.Username);
                window.location.assign("../../pages/staff/dashboard.html");
  
              }
            }else{
              window.location.assign("error.html");
            }


          }).catch(error => console.error('Error:', error));


      })
      .catch(error => console.error('Error:', error));
  }
}





