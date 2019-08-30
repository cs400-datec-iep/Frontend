function create_project() {
    //get input values
    var projectName = document.getElementById("projName").value;
    var projClient = document.getElementById("projClient").value;
    var projDesc = document.getElementById("projDesc").value;
    var projStartDate = document.getElementById("projStartDate").value;
    var projEndDate = document.getElementById("projEndDate").value;
    var userIdList = JSON.parse(localStorage.getItem("userIDs"));

    token = sessionStorage.getItem("token");
    urlGetProjectID = 'https://datectestapi.azurewebsites.net/api/GetLastProjectID';

    if (projStartDate > projEndDate) {
        alert("Dates do not match!");
    } else if (projStartDate == projEndDate) {
        alert("Dates do not match!");
    } else {

        //data encapsulation
        var payload_project = {
            'Name': projectName,
            'Description': projDesc,
            'Start_Date': projStartDate,
            'End_Date': projEndDate,
            'Client_Name': projClient,
            'Expected_Date': projEndDate,
            'Progress_Status': "OnGoing",
            'Percentage': 0,
            'Status': 1,
            'Critical_flag': 0
        };

        //create project
        fetch(urlGetProjectID, {
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

        //get id of last project created

        //link users to project

    }





    // console.log(projectName);
    // console.log(projClient);
    // console.log(projDesc);
    // console.log(projStartDate);
    // console.log(projEndDate);
    // console.log(userIdList);
}