/*////////////////////////////////////

Function to initailize Smart Reporting

*/ ////////////////////////////////////
$(document).ready(function() {
  //Url
  var urlGetAllProjects = urlMain + "api/Projects";

  //Fetch All Projects
  fetch(urlGetAllProjects, {
    async: false,
    method: "GET",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  })
    .then(function(a) {
      return a.json();
    })
    .then(function(j) {
      //Variable decalrations
      var chart_payload = [];
      var calendar_payload = [];
      var num_ongoing = 0,
        num_onhold = 0,
        num_completed = 0,
        num_cancelled = 0,
        counter = 0;
      var col_payload = [];
      col_payload.push(["Project Name", "Cost", "Billed"]);
      var active_proj = 0,
        inactive_proj = 0;
      var timeline_payload = [];

      //Set datasets
      j.forEach(element => {
        if (element.Status == true) {
          //Expected work vs work done calculation
          var start_date = moment(element.Start_Date);
          var date_now = moment(new Date());
          var diff = date_now.diff(start_date, "days");
          var percentage = (diff / element.number_of_days) * 100;

          //Percentage completions per project
          chart_payload.push([
            element.Name,
            parseInt(element.Percentage) + "%",
            parseInt(percentage) + "%"
          ]);

          //Calendar data & Timeline
          if (element.Critical_flag == true) {
            calendar_payload.push([
              new Date(moment(element.Expected_Date)),
              -50,
              element.Name +
                " - " +
                moment(element.Expected_Date).format("MMM dddd, YYYY")
            ]);
            timeline_payload.push([
              element.Name,
              "Critical!",
              moment(element.Start_Date).format("DD/MM/YYYY"),
              moment(element.Expected_Date).format("DD/MM/YYYY")
            ]);
          } else {
            calendar_payload.push([
              new Date(moment(element.Expected_Date)),
              element.ProjectID,
              element.Name +
                " - " +
                moment(element.Expected_Date).format("MMM dddd, YYYY")
            ]);
            timeline_payload.push([
              element.Name,
              "Onschedule",
              moment(element.Start_Date).format("DD/MM/YYYY"),
              moment(element.Expected_Date).format("DD/MM/YYYY")
            ]);
          }

          //Amount cost vs billed
          col_payload.push([
            element.Name,
            element.amount_cost,
            element.amount_billed
          ]);
        }
        //Projects comeplted
        if (element.Progress_Status === "OnGoing") {
          num_ongoing++;
        } else if (element.Progress_Status === "OnHold") {
          num_onhold++;
        } else if (element.Progress_Status === "Completed") {
          num_completed++;
        } else if (element.Progress_Status === "Cancelled") {
          num_cancelled++;
        }

        //Active vs inactive projects
        if (element.Status === true) {
          active_proj++;
        } else if (element.Status === false) {
          inactive_proj++;
        }

        counter++;
      });

      document.getElementById("date").innerHTML =
        "\t\t" +
        moment().format("dddd do MMMM, YYYY") +
        "\t\t at " +
        moment().format(" h:mm a");
      document.getElementById("number_project").innerHTML = j.length;
      document.getElementById("num_ongoing").innerHTML =
        parseInt((num_ongoing / counter) * 100) +
        "% (" +
        num_ongoing +
        " out of " +
        counter +
        " projects)";
      document.getElementById("num_onhold").innerHTML =
        parseInt((num_onhold / counter) * 100) +
        "% (" +
        num_onhold +
        " out of " +
        counter +
        " projects)";
      document.getElementById("num_cancelled").innerHTML =
        parseInt((num_cancelled / counter) * 100) +
        "% (" +
        num_cancelled +
        " out of " +
        counter +
        " projects)";
      document.getElementById("num_completed").innerHTML =
        "&nbsp" +
        parseInt((num_completed / counter) * 100) +
        "% (" +
        num_completed +
        " out of " +
        counter +
        " projects)";

      document.getElementById("num_active").innerHTML =
        "&nbsp" + active_proj + " projects.";

      document.getElementById("num_inactive").innerHTML =
        "&nbsp" + inactive_proj + " projects.";

      $("#project_percentage_complete").DataTable({
        data: chart_payload,
        columns: [{ data: [0] }, { data: [1] }, { data: [2] }],
        paging: false,
        sDom: "t",
        ordering: false,
        info: false
      });

      $("#project_exp_due").DataTable({
        data: timeline_payload,
        columns: [{ data: [0] }, { data: [1] }, { data: [2] }, { data: [3] }],
        columnDefs: [
          {
            targets: [1],
            visible: false,
            searchable: false
          }
        ],
        createdRow: function(row, data) {
          if (data[1] == "Critical!") {
            $(row).addClass("font-weight-bolder font-italic text-uppercase");
          }
        },
        paging: false,
        sDom: "t",
        ordering: false,
        info: false
      });

      window.print();
    })
    .catch(error => console.error("Error:", error));
});
