$(document).ready(function () {

    var token = sessionStorage.getItem("token");
    var url = 'https://datectestapi.azurewebsites.net/api/UserMains';

    fetch(url, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => response.json())
        .then((a) => {

           // console.log(a[0]);

            // var count = 0;
            // for (var i = 0; i < a.length; ++i) {
            //     if (array[i] == 2)
            //         count++;
            // }

        })
        .catch(error => { console.error('Error:', error); return error; });

});