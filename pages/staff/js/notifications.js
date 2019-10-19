/*////////////////////////////////////

Get user notifications

*/////////////////////////////////////
$(document).ready(function () {
    //Urls
    var urlGetUserNotif = urlMain + 'api/GetLogsPerUserID/';

    //Fetch User Details
    fetch(urlGetUserNotif + sessionStorage.getItem("userID"), {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
    .then(function (j) {

        if(j.length > 0){
            document.getElementById("notif_counter").innerHTML = j.length+"+";

            j.forEach(element => {
                var a = document.createElement("a");
                a.classList.add("dropdown-item", "d-flex","align-items-center");

                var icon_warpper =  document.createElement("div");
                icon_warpper.classList.add("mr-3");

                var icon_container = document.createElement("div");
                icon_container.classList.add("icon-circle", "bg-primary");

                var icon = document.createElement("i");
                icon.classList.add("fas", "fa-file-alt" ,"text-white");

                var text_container =  document.createElement("div");

                var date =  document.createElement("div");
                date.classList.add("small", "text-gray-500");
                date.innerHTML = moment(element.TimeStamp).format("MMMM D, YYYY");

                var text =  document.createElement("span");
                text.innerHTML = element.Event_Description;

                icon_warpper.appendChild(icon_container);
                icon_container.appendChild(icon);
                text_container.appendChild(date);
                text_container.appendChild(text);
                a.appendChild(icon_warpper);
                a.appendChild(text_container);
                document.getElementById("notifications").appendChild(a);

            });
            
        }else{
            var a = document.createElement("a");
            a.classList.add("dropdown-item", "d-flex","align-items-center","p-3");

            var text_container =  document.createElement("div");

            var text =  document.createElement("span");
            text.innerHTML = "You Have No New Notifications";

            text_container.appendChild(text);
            a.appendChild(text_container);
            document.getElementById("notifications").appendChild(a);
        }

    }).catch(error => console.error('Error:', error));

})