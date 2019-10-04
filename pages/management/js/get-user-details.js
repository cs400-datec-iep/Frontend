/*////////////////////////////////////

Get basic user info and display it

*/////////////////////////////////////
//Urls
var urlGetUserInfo = urlMain + 'api/UserMains/';

//Get html containers
var user_name = document.getElementById("user_name");
var user_email = document.getElementById("user_email");
var user_role = document.getElementById("user_role");
var user_dept = document.getElementById("user_dept");

//Fetch User Details
fetch(urlGetUserInfo + sessionStorage.getItem("userID"), {
    async: false,
    method: 'GET',
    crossDomain: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
}).then(function (a) { return a.json() })
.then(function (j) {

    //Set data
    user_name.innerHTML = j.Username;
    user_email.innerHTML = j.Email;
    user_role.innerHTML = j.Role;
    user_dept.innerHTML = j.Department;

    //Removing loading icon and display output
    document.getElementById("load").style.display = "none";
    document.getElementById("container").classList.remove("display-none");

}).catch(error => console.error('Error:', error));