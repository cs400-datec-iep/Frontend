/*////////////////////////////////////

Function to initialize the task view page

*/////////////////////////////////////
$(document).ready(function () {
    // Urls

    //Place project name into document variables
    document.getElementById("project_name_side").innerHTML = sessionStorage.getItem('ProjectName');
    document.getElementById("project_name_crumb").innerHTML = sessionStorage.getItem('ProjectName');

    // Setting links with project ID
    document.getElementById('view_project_link').setAttribute("href","view_project.html?"+ sessionStorage.getItem('ProjectID'));

    // Initialize Dropdown For Members
    $('#members_list')
    .dropdown({
      onChange: function(value){
        userIdList.push(value);
        console.log(value);
    }
    });

    // Initialize Dropdown For Task Predecessors
    $('#taskPredecesor')
    .dropdown({
      placeholder:'Please Select Task Predecesors:',
    });

    //Initialize datatable
    table = $('#taskTable').DataTable(
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

    //Remove loading icon and display output
    document.getElementById("load").style.display = "none";
    document.getElementById("container").classList.remove("display-none");

    //Remove loading icon and display output for sidebar
    document.getElementById("icon_container").classList.remove("display-none");
    document.getElementById("sidebarToggle").classList.remove("display-none");

});