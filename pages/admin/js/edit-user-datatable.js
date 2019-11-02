/*////////////////////////////////////

Function to populate datatable with all users

*/ ////////////////////////////////////
$(document).ready(function() {
  //Urls
  var urlGetUserMains = urlMain + "api/UserMains";
  var table;

  Swal.fire({
    title: "Please wait...",
    customClass: "swal-load",
    allowOutsideClick: false
  });
  Swal.showLoading();

  fetch(urlGetUserMains, {
    async: false,
    method: "GET",
    crossDomain: true,
    headers: {
      Authorization: "Bearer " + token
    }
  })
    .then(response => response.json())
    .then(a => {
      //Genrate table
      table = $("#fluidTable").DataTable({
        data: a,
        select: true,
        columns: [
          { data: "ID" },
          { data: "Username" },
          { data: "Email" },
          { data: "Role" },
          { data: "Department" },
          { data: "Status" }
        ],
        columnDefs: [
          {
            targets: [0],
            visible: false,
            searchable: false
          }
        ]
      });

      //Edit user onclick
      $("#fluidTable tbody").on("click", "tr", function() {
        if ($(this).hasClass("clickedon")) {
          $(this).removeClass("clickedon");
          document.getElementById("edit_button").disabled = true;
        } else {
          table.$("tr.clickedon").removeClass("clickedon");
          $(this).addClass("clickedon");
          document.getElementById("edit_button").disabled = false;
        }

        //Load clicked user details into modal
        $("#edit_button").on("click", function() {
          var oData = table.rows(".clickedon").data();

          document.getElementById("id").value = oData[0].ID;
          document.getElementById("userName").value = oData[0].Username;
          document.getElementById("role").value = oData[0].Role;
          document.getElementById("prev_role").value = oData[0].Role;
          document.getElementById("department").value = oData[0].Department;
          document.getElementById("email").value = oData[0].Email;
        });
      });

      //Removing loading icon and display output
      Swal.close();
      document.getElementById("container").classList.remove("display-none");
    })
    .catch(error => {
      Swal.fire({
        title: "Error!",
        text: error,
        type: "error",
        allowOutsideClick: false,
        confirmButtonText: "Ok"
      });
    });
});
