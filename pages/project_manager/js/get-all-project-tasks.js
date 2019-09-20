/*////////////////////////////////////

Function to get all tasks and initialize the task view page

*/////////////////////////////////////
$(document).ready(function () {

    //Initialize datatable
    table = $('#taskTable').DataTable(
        // {
        //   data: a,
        //   select: true,
        //   columns: [
        //     { data: 'ID' },
        //     { data: 'Username' },
        //     { data: 'Email' },
        //     { data: 'Role' },
        //     { data: 'Department' },
        //     { data: 'Status' }
        //   ]
        // }
      );

    //Remove loading icon and display output
    document.getElementById("load").style.display = "none";
    document.getElementById("container").classList.remove("display-none");

    //Remove loading icon and display output for sidebar
    document.getElementById("icon_container").classList.remove("display-none");
    document.getElementById("sidebarToggle").classList.remove("display-none");

});