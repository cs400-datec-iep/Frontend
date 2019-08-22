function create_user() {

    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
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
            .then(function (j) {
                console.log("this is from create_user js ID:" + j);
                sessionStorage.setItem("created_User", j);
                return j;
            }).catch(error => { console.error('Error:', error); return error; });


            //making payload
            var payload_usermains = {
                "ID": sessionStorage.getItem("created_User"),
                "Username": firstName + " " + lastName,
                "Department": department,
                "Email": email,
                "Status": true,
                "Role": role
            };

            
            fetch(url_usermains, {
                async: false,
                method: 'POST',
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(payload_usermains)
            }).then(function (a) { console.log("sssssss" + a.json()); return a.json(); })
                .then(function (j) {
                    console.log("this is from create_user js response usermains :" + j);
                    return j;
                }).catch(error => { console.error('Error:', error); return error; });
    

        



        // console.log(lastName);
        // console.log(role);
        // console.log(department);
        // console.log(email);
        // console.log(password);
        // console.log(confirmPassword);
    }

}