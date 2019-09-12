// populate edit dropdown
$(document).ready(function () {
  var token = sessionStorage.getItem("token");
  var url = 'https://datectestapi.azurewebsites.net/api/GetActiveUserForAddMembers/' + sessionStorage.getItem("userID");
  ;

  fetch(url, {
    async: false,
    method: 'GET',
    crossDomain: true,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).then(response => response.json())
    .then((a) => {

      for(var i = 0; i < a.length; i++){
        // if(user_array[i].value == a[i].ID){
        //   $('#members_list').append($('<option>', {
        //     value: a[i].ID,
        //     text: a[i].Username,
        //     selected: true
        //   }))
        // }else{
        //   $('#members_list').append($('<option>', {
        //     value: a[i].ID,
        //     text: a[i].Username,
        //   }))
        // }
      }

    }).catch(error => { console.error('Error:', error); return error; });

  // new change
});
