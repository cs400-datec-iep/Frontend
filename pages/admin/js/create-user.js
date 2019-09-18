/*////////////////////////////////////

Function to create a user

*/////////////////////////////////////
function create_user() {
    //Urls
    var urlRegisterAccount = urlMain+'api/Account/Register';
    var urlRegisterUserMain = urlMain+'api/UserMains';

    //Get html containers
    var userName = document.getElementById("userName").value;
    var role = document.getElementById("role").value;
    var department = document.getElementById("department").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    //Check if passwords match
    if (password != confirmPassword) {
        alert("Passwords do not match!");
    } else {

        //data encapsulation
        var payload_user = {
            'Email': email,
            'Password': password,
            'ConfirmPassword': confirmPassword
        };

        //Register User into Database
        fetch(urlRegisterAccount, {
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
                //Making payload
                var payload_usermains = {
                    "ID": id,
                    "Username": userName,
                    "Department": department,
                    "Email": email,
                    "Status": true,
                    "Role": role
                };

                //Upload to user Main table if registered
                fetch(urlRegisterUserMain, {
                    async: false,
                    method: 'POST',
                    crossDomain: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(payload_usermains)
                }).then(function (a) { 
                    alert("User Successfully Created"); 
                    window.location.assign("edit_user.html");
                    return a.json(); 
            }).catch(error => { console.error('Error:', error);  return error; });
        }).catch(error => { 

            console.error('Error:', error); 
            alert("Error Processing Request, Refreshing page")
            window.location.reload;

            return error; });
    }
}