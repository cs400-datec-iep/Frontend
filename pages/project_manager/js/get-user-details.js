
 var userID =  sessionStorage.getItem("userID");
 var token = sessionStorage.getItem("token");
 var urlGetProjectID = 'https://datectestapi.azurewebsites.net/api/UserMains/'+userID;


 fetch(urlGetProjectID, {
     async: false,
     method: 'GET',
     crossDomain: true,
     headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Bearer ' + token
     }
 }).then(function (a) { return a.json() })
 .then(function (j) {
    // get ids to put data in
    var user_name =  document.getElementById("user_name");
    var user_email =  document.getElementById("user_email");
    var user_role =  document.getElementById("user_role");
    var user_dept =  document.getElementById("user_dept");

    // set data
    user_name.innerHTML = j.Username;
    user_email.innerHTML = j.Email;
    user_role.innerHTML = j.Role;
    user_dept.innerHTML = j.Department;

    document.getElementById("load").style.display = "none";
    document.getElementById("page_content").classList.remove("display-none");

 }).catch(error => console.error('Error:', error));