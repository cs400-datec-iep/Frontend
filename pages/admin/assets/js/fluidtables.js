
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
      var table = $('#fluidTable').DataTable(
        {
          data: a,
          select: true,
          columns: [
            { data: 'ID' },
            { data: 'Username' },
            { data: 'Email' },
            { data: 'Role' },
            { data: 'Department' },
            { data: 'Status' }
          ]
        }
      );

      
      $('#fluidTable tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );
 
    $('#button').click( function () {
        table.row('.selected').remove().draw( false );
    } );

      //table.column(0).visible(false);
     
    }).catch(error => { console.error('Error:', error); return error; });



});
