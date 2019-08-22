function create_user(){

    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var role = document.getElementById("role").value;
    var department = document.getElementById("department").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;


    if(password != confirmPassword){
        alert("Passwords do not match!");
    }else{
            
        //data encapsulation
        var payload_user = {
            'Email': email,
            'Password': password,
            'ConfirmPassword': confirmPassword
        };
        token = sessionStorage.getItem("token");
        var url = 'https://datectestapi.azurewebsites.net/api/Account/Register';

        //where u put the function :> achaa
        var res = post_Json_Data(payload_user, token, url);
        console.log(res);

        // console.log(firstName);
        // console.log(lastName);
        // console.log(role);
        // console.log(department);
        // console.log(email);
        // console.log(password);
        // console.log(confirmPassword);
    }

}