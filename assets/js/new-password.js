/*////////////////////////////////////

Function to change user password from reset request

*/////////////////////////////////////
function resetPassword(){
    //Urls
    var urlResetPassword = urlMain+"api/Account/ConfirmResetPassword";

    //Get html values
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirmPassword').value;

    //Get email from url
    var url_string = window.location.href;
    var url = new URL(url_string);
    var email = url.searchParams.get("em");

    //Get reset token
    var url = window.location.href;
    var reset_token = url.substring(url.lastIndexOf('ResTk=') + 6);

    if (password != confirmPassword) {
        alert("Passwords do not match!");
    } else {

        //Data encapsulation
        var payload_resetPass = {
            "Code": reset_token,
            "ConfirmPassword": confirmPassword,
            "Email": email,
            "Password": password
        }

        fetch(urlResetPassword, {
            async: true,
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload_resetPass)
        }).then(function (a) { return a.json(); })
        .then(function (j) {

            console.log(j);

            alert("Your password has been reset, please use your new password to login. You will now be redirected back to the login page");
            // window.location.assign("index.html");

        }).catch(error => { console.error('Error:', error); return error; });

    }
    
};
