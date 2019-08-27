$(document).ready(function () {

    token = sessionStorage.getItem("token");
    var urlGetTotal_Staff = 'https://datectestapi.azurewebsites.net/api/GetCountRole/Staff';
    var urlGetTotal_PM = 'https://datectestapi.azurewebsites.net/api/GetCountRole/Project Manager';
    var urlGetTotal_Management = 'https://datectestapi.azurewebsites.net/api/GetCountRole/Management';


    //Get table count data staff
    fetch(urlGetTotal_Staff, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
        .then(function (j) {
            sessionStorage.setItem("numStaff", j.Result);
            document.getElementById("Number_of_Staff").innerHTML = j.Result;

        })
        .catch(error => { console.error('Error:', error); return error; });


    //Get table count data Project manager
    fetch(urlGetTotal_PM, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
        .then(function (j) {
            sessionStorage.setItem("numPM", j.Result);
            document.getElementById("Number_of_PM").innerHTML = j.Result;

        })
        .catch(error => { console.error('Error:', error); return error; });


    //Get table count data Management
    fetch(urlGetTotal_Management, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
        .then(function (j) {
            sessionStorage.setItem("numManager", j.Result);
            document.getElementById("Number_of_Management").innerHTML = j.Result;

        })
        .catch(error => { console.error('Error:', error); return error; });

    var total = parseInt(sessionStorage.getItem("numManager")) + parseInt(sessionStorage.getItem("numPM")) + parseInt(sessionStorage.getItem("numStaff"));
    document.getElementById("Number_of_User").innerHTML = total;

    sessionStorage.removeItem("numManager");
    sessionStorage.removeItem("numPM");
    sessionStorage.removeItem("numStaff");


});