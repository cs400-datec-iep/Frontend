function editPassword() {
    token = sessionStorage.getItem("token");
    urlPostPasswordChange = 'https://datectestapi.azurewebsites.net/api/Account/ChangePassword';

    // Get data from modal
    var oldpassword = document.getElementById("oldpassword").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("passwordConfirm").value;
    
    if(password == "" || oldpassword == "" || confirmPassword == ""){
        alert("Please fill all fields!");
    }else if(password != confirmPassword){
        alert("Passwords do not match!");
    }else{
        //data encapsulation
        var payload_password = {
            'OldPassword': oldpassword,
            'NewPassword': password,
            'ConfirmPassword': confirmPassword
        }

        //create change password
        fetch(urlPostPasswordChange, {
            async: false,
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload_password)
        }).then(function (a) { 
            console.log(a.json());
            return a.json();
        }).catch(error => { console.error('Error:', error); return error; });
    }
}