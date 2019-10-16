/*////////////////////////////////////

Function to Populate the memebers dropdown in edit modal

*/////////////////////////////////////
$(document).ready(function () {
  //Get Project ID
  var url = window.location.href;
  var projectID = url.substring(url.lastIndexOf('?') + 1);

  //Urls
  var urlGetAllUsers = urlMain+'api/GetActiveUserForAddMembers/'+sessionStorage.getItem("userID");
  var urlGetProjectTeam = urlMain+'api/GetMembersProjectID/'+projectID;

  //Get all users in system
  fetch(urlGetAllUsers, {
    async: false,
    method: 'GET',
    crossDomain: true,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).then(response => response.json())
    .then((a) => {

      //Get all project team members
      fetch(urlGetProjectTeam, {
          async: false,
          method: 'GET',
          crossDomain: true,
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
          }
      }).then(function (a) { return a.json() })
      .then(function (k) {

        //Append Project team members as selected and all users as options
        a.forEach(a_element => {
          k.forEach(k_element => {
            $('#members_list').append($('<option>', {
              value: k_element.ID,
              text: k_element.Username,
              selected: true
            }));
  
          });
          $('#members_list').append($('<option>', {
            value: a_element.ID,
            text: a_element.Username,
          }));
        });


      }).catch(error => { console.error('Error:', error); return error; });

    }).catch(error => { console.error('Error:', error); return error; });
});
