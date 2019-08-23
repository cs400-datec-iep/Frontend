
// populate table
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
      console.log('A VALUE: ', a[2]);
      var data = a;
      $('#fluidTable').DataTable(
        {
          data: a ,
          columns: [
            { data: 'Username' },
            { data: 'Department' },
            { data: 'Email' },
            { data: 'Status' },
            { data: 'Role' }
        ]
        }
      );
      // var table = document.getElementById('fluidTable');
      //       data.forEach(function(object) {
      //           var tr = document.createElement('tr');
      //           tr.innerHTML = '<td>' + object.Username + '</td>' +
      //           '<td>' + object.Email + '</td>' +
      //           '<td>' + object.Role + '</td>' +
      //           '<td>' + object.Department + '</td>' +
      //           '<td>' + object.Status + '</td>' +
      //           '<td style=text-align:center;">' +
      //           '<a class="btn btn-danger dash-edit-button" data-toggle="modal"data-target="#editModal">Edit</a>'+
      //           '</td>';

      //           table.appendChild(tr);
      //       });

      
    }).catch(error => { console.error('Error:', error); return error; });

    
  
});
