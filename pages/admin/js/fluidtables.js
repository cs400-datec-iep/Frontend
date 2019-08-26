// populate table
$(document).ready(function () {
  var table;
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
      table = $('#fluidTable').DataTable(
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
      
    $('#fluidTable tbody').on('click', 'tr', function () {
      if ($(this).hasClass('clickedon')) {
        $(this).removeClass('clickedon');
        document.getElementById("edit_button").disabled = true;
      }
      else {
        table.$('tr.clickedon').removeClass('clickedon');
        $(this).addClass('clickedon');
        document.getElementById("edit_button").disabled = false;
      }

      $('#edit_button').on("click", function () {
        var oData = table.rows('.clickedon').data();
        
        document.getElementById('id').value = oData[0].ID;
        document.getElementById('userName').value = oData[0].Username;
        document.getElementById('role').value = oData[0].Role;
        document.getElementById('department').value = oData[0].Department;
        document.getElementById('email').value = oData[0].Email;

      });

    });

    table.column(0).visible(false);

    }).catch(error => { console.error('Error:', error); return error; });



});
