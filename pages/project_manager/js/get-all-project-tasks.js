/*////////////////////////////////////

Function to get all tasks and initialize the task view page

*/////////////////////////////////////
$(document).ready(function () {
  // Urls
  urlGetTask = urlMain + "api/GetTasksPerProject/" + sessionStorage.getItem('ProjectID');

  // Initialize Dropdown For Members
  $('#members_list')
  .dropdown({
    onChange: function (value) {
      userIdList.push(value);
      console.log(value);
    }
  });

  // Initialize Dropdown For Predecessors
  $('#taskPredecesor')
  .dropdown({
    placeholder:'Please Select Task Predecesors:',
    onChange: function (value) {
      selected_tasks_array.push(value);
      console.log(value);
    }
  });

  //Place project name into document variables
  document.getElementById("project_name_side").innerHTML = sessionStorage.getItem('ProjectName');

  //Making Breadcrumb link
  var a = document.createElement("a");
  a.setAttribute("href","view_project.html?"+ sessionStorage.getItem('ProjectID'));
  a.innerHTML = sessionStorage.getItem('ProjectName');
  document.getElementById("project_name_crumb").appendChild(a);

  // Setting links with project ID
  document.getElementById('view_project_link').setAttribute("href","view_project.html?"+ sessionStorage.getItem('ProjectID'));
  document.getElementById('page_title').innerHTML =  sessionStorage.getItem('ProjectName');
 

  fetch(urlGetTask, {
    async: false,
    method: 'GET',
    crossDomain: true,
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).then(response => response.json())
    .then((a) => {
      //Dataset array
      var dataset = [];
      tasks_array = JSON.stringify(a);

      a.forEach(element => {

        //Parsing date into correct format
        var datestart = new Date(element.Start_Date);
        datestart = moment(datestart).format('DD-MMM-YYYY');

        //Populate task predecessor
        $('#taskPredecesor').append($('<option>', {
          value: element.TaskID,
          text: element.Name,
        }));

        // Check task type (Prepare array for datatable)
        if (element.If_Milestone === false && element.If_Objective === false) {

          var dataObj = {
            "TaskID" : element.TaskID,
            "Type" : "Task",
            "Name" : element.Name,
            "Start_Date" : datestart,
            "Status" : element.Progress_Status,
            "Duration" : element.Number_of_days,
          };

          dataset.push(dataObj);

        } else if (element.If_Objective === true && element.If_Milestone === false) {

          var dataObj = {
            "TaskID" : element.TaskID,
            "Type" :"Objective",
            "Name" : element.Name,
            "Start_Date" : datestart,
            "Status" : element.Progress_Status,
            "Duration" : element.Number_of_days,
          };

          dataset.push(dataObj);

        } else if (element.If_Milestone === true && element.If_Objective === false) {

          var dataObj = {
            "TaskID" : element.TaskID,
            "Type" :"Milestone",
            "Name" : element.Name,
            "Start_Date" : datestart,
            "Status" : element.Progress_Status,
            "Duration" : element.Number_of_days,
          };

          dataset.push(dataObj);

        }

      });

      //Initialize datatable
      table = $('#taskTable').DataTable(
        {
          data: dataset,
          select: true,
          columns: [
            { data: 'TaskID' },
            { data: 'Type' },
            { data: 'Name' },
            { data: 'Start_Date' },
            { data: 'Status' },
            { data: 'Duration' }
          ]
        }
      );

      $('#taskTable tbody').on( 'click', 'tr', function () {
        sessionStorage.setItem("task_array",tasks_array);
        window.location.assign("view_task_details.html?"+table.row( this ).data().TaskID);
      });

      //Remove loading icon and display output
      document.getElementById("load").style.display = "none";
      document.getElementById("container").classList.remove("display-none");

      //Remove loading icon and display output for sidebar
      document.getElementById("icon_container").classList.remove("display-none");
      document.getElementById("sidebarToggle").classList.remove("display-none");


    }).catch(error => { console.error('Error:', error); return error; });


});