/*////////////////////////////////////

Function to change user password on first login

*/////////////////////////////////////
function newPassword() {
    //Urls
    var urlPostPasswordChange = urlMain+'api/Account/ChangePassword';
    var urlChangeFirstLoginBool = urlMain+'api/Account/FirstLogin/'+ sessionStorage.getItem("userID");

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
            if(a.status == 400){
                alert("Passwords must contain: An uppercase character, a lowercase character, a number and a symbol.");
            }else{

                fetch(urlChangeFirstLoginBool, {
                    async: false,
                    method: 'POST',
                    crossDomain: true,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).then(function (b) { 
                    alert("Your password has been successfully changed, you will now be redirected to the login page");
                    window.location.assign("../../index.html");
                }).catch(error => console.error('Error:', error));
            }
        }).catch(error => { console.error('Error:', error); return error; });   
    }
}