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
            localStorage.setItem("numStaff", j.Result);
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
            localStorage.setItem("numPM", j.Result);
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
            localStorage.setItem("numManager", j.Result);
            document.getElementById("Number_of_Management").innerHTML = j.Result;
            var total = parseInt(localStorage.getItem("numManager")) + parseInt(localStorage.getItem("numPM")) + parseInt(localStorage.getItem("numStaff"));
            document.getElementById("Number_of_User").innerHTML = total;

        })
        .catch(error => { console.error('Error:', error); return error; });

}); 