// Call the dataTables jQuery plugin
$(document).ready(function () {
  $('#fluidTable').DataTable();
});

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
  }).then(function (a) {
    console.log(a.json());
    var data = a.json();
    var table = document.getElementById('fluidTable');


    data.forEach(function (object) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>' + object.COUNTRY + '</td>' +
        '<td>' + object.LoC + '</td>' +
        '<td>' + object.BALANCE + '</td>' +
        '<td>' + object.DATE + '</td>';
      table.appendChild(tr);
    });

  })
    .catch(error => { console.error('Error:', error); return error; });



});
