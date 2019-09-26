/*////////////////////////////////////

Function to change user password

*/////////////////////////////////////
function editPassword() {
    //Urls
    urlPostPasswordChange = urlMain+'api/Account/ChangePassword';

    // Get data from modal
    var oldpassword = document.getElementById("oldpassword").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("passwordConfirm").value;
    
    //Password Validation
    if(password == "" || oldpassword == "" || confirmPassword == ""){
        alert("Please fill all fields!");
    }else if(password != confirmPassword){
        alert("Passwords do not match!");
    }else{
        //Data encapsulation
        var payload_password = {
            'OldPassword': oldpassword,
            'NewPassword': password,
            'ConfirmPassword': confirmPassword
        }

        //Change password
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
            alert("Your password has been successfully changed.");
        }).catch(error => { console.error('Error:', error); return error; });
    }
}