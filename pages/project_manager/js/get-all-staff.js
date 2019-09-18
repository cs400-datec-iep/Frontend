
/*////////////////////////////////////

Function to populate staff list dropdown for create project

*/////////////////////////////////////
$(document).ready(function () {
  //Urls
  var urlGetActiveStaff = urlMain+'api/GetActiveUserForAddMembers/';

  fetch(urlGetActiveStaff + sessionStorage.getItem("userID"), {
    async: false,
    method: 'GET',
    crossDomain: true,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).then(response => response.json())
  .then((a) => {
    
    //Populate dropdown
    a.forEach(element => {
      $('#members_list').append($('<option>', {
        value: element.ID,
        text: element.Username
      }))
    });

  }).catch(error => { console.error('Error:', error); return error; });
});
