$(document).ready(function () {

    token = sessionStorage.getItem("token");
    var urlGetTotal_Staff = 'https://datectestapi.azurewebsites.net/api/GetCountRole/Staff';
    var urlGetTotal_PM = 'https://datectestapi.azurewebsites.net/api/GetCountRole/Project Manager';
    var urlGetTotal_Management = 'https://datectestapi.azurewebsites.net/api/GetCountRole/Management';

    function randomNum() {
        "use strict";
        return Math.floor(Math.random() * 9) + 1;
    }

    var loop1, loop2, loop3, loop4, time = 30, i = 0, speed = 80,
        selector4 = document.querySelector('#Number_of_Staff'),
        selector3 = document.querySelector('#Number_of_PM'),
        selector2 = document.querySelector('#Number_of_Management'),
        selector1 = document.querySelector('#Number_of_User');


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

            loop4 = setInterval(function () {
                "use strict";
                if (i > speed) {
                    clearInterval(loop4);
                    selector4.textContent = j.Result;
                } else {
                    selector4.textContent = randomNum();
                    i++;
                }
            }, time);


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

            loop3 = setInterval(function () {
                "use strict";
                if (i > speed) {
                    clearInterval(loop3);
                    selector3.textContent = j.Result;
                } else {
                    selector3.textContent = randomNum();
                    i++;
                }
            }, time);

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

            loop2 = setInterval(function () {
                "use strict";
                if (i > speed) {
                    clearInterval(loop2);
                    selector2.textContent = j.Result;
                } else {
                    selector2.textContent = randomNum();
                    i++;
                }
            }, time);

            var total = parseInt(localStorage.getItem("numManager")) + parseInt(localStorage.getItem("numPM")) + parseInt(localStorage.getItem("numStaff"));

            loop1 = setInterval(function () {
                "use strict";
                if (i > speed) {
                    clearInterval(loop1);
                    selector1.textContent = total;
                } else {
                    selector1.textContent = randomNum();
                    i++;
                }
            }, time);

        })
        .catch(error => { console.error('Error:', error); return error; });

}); 