function create_user() {

    var userName = document.getElementById("userName").value;
    var role = document.getElementById("role").value;
    var department = document.getElementById("department").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;


    if (password != confirmPassword) {
        alert("Passwords do not match!");
    } else {

        //data encapsulation
        var payload_user = {
            'Email': email,
            'Password': password,
            'ConfirmPassword': confirmPassword
        };


        token = sessionStorage.getItem("token");
        var url_register = 'https://datectestapi.azurewebsites.net/api/Account/Register';
        var url_usermains = 'https://datectestapi.azurewebsites.net/api/UserMains';


        //Register User into Database
        fetch(url_register, {
            async: false,
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload_user)
        }).then(function (a) { return a.json(); })
            .then(function (id) {
                //making payload
                var payload_usermains = {
                    "ID": id,
                    "Username": userName,
                    "Department": department,
                    "Email": email,
                    "Status": true,
                    "Role": role
                };

                //Upload to user Main table if registered
                fetch(url_usermains, {
                    async: false,
                    method: 'POST',
                    crossDomain: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(payload_usermains)
                }).then(function (a) { alert("User Created"); window.location.assign("edit_user.html");return a.json(); })
                .then(function (j) {
                    console.log(j);
                    return j;
                }).catch(error => { console.error('Error:', error); return error; });

                    
            }).catch(error => { console.error('Error:', error); return error; });
    }
}