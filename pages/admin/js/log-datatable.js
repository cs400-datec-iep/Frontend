/*////////////////////////////////////

Function to populate datatable with all logs

*/////////////////////////////////////
$(document).ready(function () {
    //Urls
    var urlGetLogs = urlMain+'api/Logs';

    fetch(urlGetLogs, {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(response => response.json())
    .then((a) => {
        //Genrate table
        table = $('#logTable').DataTable(
            {
            data: a,
            select: true,
            columns: [
                { data: 'LogID' },
                { data: 'UserID' },
                { data: 'Event_Type' },
                { data: 'Event_Description' },
                { data: 'Trigger' },
                { data: 'Module' },
                { data: 'ProjectID' },
                { data: 'TimeStamp' },
                { data: 'Viewed' }
            ],
            "columnDefs": [
                {
                    "targets": [ 8 ],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [ 4 ],
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": [ 6 ],
                    "visible": false,
                    "searchable": false
                }
                ]
            }
        );
    })


})