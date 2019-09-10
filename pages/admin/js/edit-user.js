function edit_user(){

    var id = document.getElementById('id').value ;
    var userName = document.getElementById('userName').value ;
    var role = document.getElementById('role').value ;
    var prev_role = document.getElementById('prev_role').value ;
    var department = document.getElementById('department').value ;
    var email = document.getElementById('email').value ;
    var status = document.getElementById('status').value ;
    
    token = sessionStorage.getItem("token");
    var url_usermains = 'https://datectestapi.azurewebsites.net/api/UserMains/'+id;

    if(prev_role == "Project Manager" && role!= "Project Manager"){
        confirm("Role changed from project manager, this user will be removed from the following projects and will all be placed on hold.");

    }else if(status == false && role == "Project Manager"){
        confirm("status changed from active to inactive, this user will be removed from the following projects and will all be placed on hold.");
    }

    //making payload
    var payload_usermains = {
        "ID": id,
        "Username": userName,
        "Department": department,
        "Email": email,
        "Status": status,
        "Role": role
    };

    //Upload to user Main table if registered
    fetch(url_usermains, {
        async: false,
        method: 'PUT',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload_usermains)
    }).then(function (a) { console.log("User Edited" + a.json()); 
    window.location.assign("edit_user.html");return a.json()})
    .catch(error => { console.error('Error:', error); return error; });

    sessionStorage.setItem("edit_clicked", false);
}