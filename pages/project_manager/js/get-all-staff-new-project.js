/*////////////////////////////////////

Function to populate staff list dropdown for create project

*/////////////////////////////////////
$(document).ready(function () {
    //Urls
    var urlGetActiveUserForAddMembers = urlMain+'api/GetActiveUserForAddMembers/'+sessionStorage.getItem("userID");
  
    fetch(urlGetActiveUserForAddMembers, {
      async: false,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
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
  