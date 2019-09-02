$(document).ready(function () {

    //get ID from url
    var url = window.location.href;
    var projectID = url.substring(url.lastIndexOf('?') + 1);

    var token = sessionStorage.getItem("token");
    var urlGetProjectID = 'https://datectestapi.azurewebsites.net/api/Projects/'+projectID;

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
        //get document id's to place data in
        var project_name =  document.getElementById("project_name_title");
        var project_name_side =  document.getElementById("project_name_side");
        var project_name_crumb =  document.getElementById("project_name_crumb");
        var project_client =  document.getElementById("project_client");

        

        var project_desc =  document.getElementById("project_desc");

        project_name.innerHTML = j.Name;
        project_name_side.innerHTML = j.Name;
        project_name_crumb.innerHTML = j.Name;

        project_desc.innerHTML = j.Description;
        project_client.classList.add('project-details-text');
        project_client.innerHTML = j.Client_Name;

        console.log(j);
    })
    .catch(error => { console.error('Error:', error); return error; });
});