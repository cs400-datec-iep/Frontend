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


        var res_register = post_Json_Data(payload_user, token, url_register);
        console.log("this is from create_user js :" + sessionStorage.getItem("created_User"));
        console.log("this is from create_user js response :" + res_register);

        while (sessionStorage.getItem("created_User") == "null") {

            
             console.log("Waiting");

        }

        if (sessionStorage.getItem("created_User") != "null") {
            //making payload
            var payload_usermains = {
                "ID": sessionStorage.getItem("created_User"),
                "Username": firstName + " " + lastName,
                "Department": department,
                "Email": email,
                "Status": true,
                "Role": role
            };

            console.log(JSON.stringify(payload_usermains));
            var res_usermains = post_Json_Data(payload_usermains, token, url_usermains);
            console.log("this is from create_user js response usermains :" + res_usermains);

        }


        
        // console.log(lastName);
        // console.log(role);
        // console.log(department);
        // console.log(email);
        // console.log(password);
        // console.log(confirmPassword);
    }

}