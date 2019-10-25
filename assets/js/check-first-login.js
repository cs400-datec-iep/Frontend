/*////////////////////////////////////

Check if user first login

*/////////////////////////////////////
$(document).ready(function () {
    //Urls
    var urlGetUserInfo = urlMain + 'api/UserMains/';

    //Fetch User Details
    fetch(urlGetUserInfo + sessionStorage.getItem("userID"), {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
    .then(function (j) {

        if(j.firstLogin == true){
            //First Login modal
            var btn = document.createElement("button");
            btn.id = "click";
            btn.setAttribute("data-toggle","modal");
            btn.setAttribute("data-target","#firstLoginModal");
            btn.setAttribute("hidden","true");
            document.getElementById("content").appendChild(btn);
            $('#click').trigger('click');
        }

    }).catch(error => console.error('Error:', error));
});