/*////////////////////////////////////

Function to initailize Smart Reporting

*/ ////////////////////////////////////
$(document).ready(function() {
  //Url
  var urlGetAllProjects = urlMain + "api/Projects";

  Swal.fire({
    title: "Analyzing...",
    customClass: "swal-load",
    allowOutsideClick: false
  });
  Swal.showLoading();

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
      chart_payload.push(["Project Name", "Work Done", "Expected Work"]);
      var calendar_payload = [];
      var num_ongoing = 0,
        num_onhold = 0,
        num_completed = 0,
        num_cancelled = 0;
      var col_payload = [];
      col_payload.push(["Project Name", "Cost", "Billed"]);
      var active_proj = 0,
        inactive_proj = 0;
      var timeline_payload = [];
      var uri_array = [];

      //Set datasets
      j.forEach(element => {
        if (element.Status == true) {
          //Expected work vs work done calculation
          var start_date = moment(element.Start_Date);
          var date_now = moment(new Date());
          var diff = date_now.diff(start_date, "days");
          var percentage = (diff / element.number_of_days) * 100;

          //Percentage completions per project
          if (percentage >= 100) {
            chart_payload.push([element.Name, element.Percentage, 100]);
          } else {
            chart_payload.push([element.Name, element.Percentage, percentage]);
          }

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
              new Date(element.Start_Date),
              new Date(element.Expected_Date)
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
              "On schedule",
              new Date(element.Start_Date),
              new Date(element.Expected_Date)
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
      });

      //////////////////////////////////////////////////////
      //Data for Report Generation
      //////////////////////////////////////////////////////
      sessionStorage.setItem("duedates", JSON.stringify(chart_payload));
      sessionStorage.setItem("timeline", JSON.stringify(timeline_payload));
      sessionStorage.setItem("billing", JSON.stringify(col_payload));

      var project_status = [{ active_proj, inactive_proj }];
      sessionStorage.setItem("project_status", JSON.stringify(project_status));

      var ongoing = "On Going Projects";
      var onhold = "On Hold Projects";
      var cancelled = "Cancelled Projects";
      var completed = "Completed Projects";

      var project_progress_status = [
        { ongoing, num_ongoing },
        { onhold, num_onhold },
        { cancelled, num_completed },
        { completed, num_cancelled }
      ];
      sessionStorage.setItem(
        "project_progress_status",
        JSON.stringify(project_progress_status)
      );

      //Project status chart
      google.charts.load("current", { packages: ["timeline"] });
      google.charts.setOnLoadCallback(drawTimeline);
      function drawTimeline() {
        var container = document.getElementById("project_calender_chart2");
        var chart = new google.visualization.Timeline(container);
        var dataTable = new google.visualization.DataTable();

        dataTable.addColumn({ type: "string", id: "Project Name" });
        dataTable.addColumn({ type: "string", id: "Critical" });
        dataTable.addColumn({ type: "date", id: "Start" });
        dataTable.addColumn({ type: "date", id: "End" });
        dataTable.addRows(timeline_payload);

        // set inner height to 30 pixels per row
        var chartAreaHeight = dataTable.getNumberOfRows() * 30;
        // add padding to outer height to accomodate title, axis labels, etc
        var chartHeight = chartAreaHeight + 100;

        var options = {
          height: chartHeight,
          chartArea: {
            height: chartAreaHeight
          }
        };

        chart.draw(dataTable, options);
      }

      //Project percentage compeleted Chart
      google.charts.load("current", { packages: ["bar"] });
      google.charts.setOnLoadCallback(drawBasic);
      function drawBasic() {
        var data = google.visualization.arrayToDataTable(chart_payload);

        // set inner height to 30 pixels per row
        var chartAreaHeight = data.getNumberOfRows() * 30;
        // add padding to outer height to accomodate title, axis labels, etc
        var chartHeight = chartAreaHeight + 80;

        var options = {
          height: chartHeight,
          chartArea: {
            height: chartAreaHeight
          },
          bars: "horizontal",
          hAxis: {
            title: "Percentage Complete (%)",
            minValue: 0
          },
          vAxis: {
            title: "Project Name"
          }
        };

        var div = document.getElementById("project_percentage_chart");
        var chart = new google.charts.Bar(div);

        chart.draw(data, google.charts.Bar.convertOptions(options));
      }

      //Calendar chart
      google.charts.load("current", { packages: ["calendar"] });
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn({ type: "date", id: "Date" });
        dataTable.addColumn({ type: "number", id: "Id" });
        dataTable.addColumn({ type: "string", role: "tooltip" });
        dataTable.addRows(calendar_payload);

        var div = document.getElementById("project_calender_chart");
        var chart = new google.visualization.Calendar(div);

        // set inner height to 30 pixels per row
        var chartAreaHeight = dataTable.getNumberOfRows() * 30;
        // add padding to outer height to accomodate title, axis labels, etc
        var size = document.getElementById("calendar_container").offsetWidth;

        var options = {
          title: "Today: " + moment().format("MMM DD, YYYY"),
          height: size / 3,
          chartArea: {
            width: "100%",
            height: chartAreaHeight
          },
          noDataPattern: {
            backgroundColor: "#858796"
          },
          calendar: {
            cellSize: size / 60,
            monthOutlineColor: {
              stroke: "#243568",
              strokeOpacity: 0.8,
              strokeWidth: 2
            },
            unusedMonthOutlineColor: {
              stroke: "#5a5c69",
              strokeOpacity: 0.8,
              strokeWidth: 1
            }
          },
          colorAxis: { colors: ["red", "#4e73df", "#4e73df"] },
          tooltip: { isHtml: false }
        };
        google.visualization.events.addListener(chart, "ready", function() {
          $($("#project_calender_chart text")[0]).text("Critical");
          $($("#project_calender_chart text")[1]).text("");
          $($("#project_calender_chart text")[2]).text("Not Critical");
        });
        chart.draw(dataTable, options);
      }

      //Project Status pie chart
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawPie);
      function drawPie() {
        var data = google.visualization.arrayToDataTable([
          ["Status", "Number"],
          ["Projects on Going", num_ongoing],
          ["Projects On Hold", num_onhold],
          ["Projects Completed", num_completed],
          ["Projects Cancelled", num_cancelled]
        ]);

        var options = {
          is3D: true,
          chartArea: {
            width: "90%",
            height: "90%"
          },
          colors: ["#4285f4", "#f6c23e", "#1cc88a", "red"]
        };

        var div = document.getElementById("project_complete_chart");
        var chart = new google.visualization.PieChart(div);

        google.visualization.events.addListener(chart, "ready", function() {
          uri_array.push(chart.getImageURI());
        });

        chart.draw(data, options);
      }

      //Doughtnut chart project active vs not-active
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawDoughnut);
      function drawDoughnut() {
        var data = google.visualization.arrayToDataTable([
          ["Status", "Number"],
          ["Active Projects", active_proj],
          ["Inactive Projects", inactive_proj]
        ]);

        var options = {
          is3D: true,
          pieHole: 0.4,
          chartArea: {
            width: "90%",
            height: "90%"
          }
        };

        var div = document.getElementById("project_active_inactive_chart");
        var chart = new google.visualization.PieChart(div);

        google.visualization.events.addListener(chart, "ready", function() {
          uri_array.push(chart.getImageURI());
        });

        chart.draw(data, options);
      }

      //Amount Billed vs Cost chart
      google.charts.load("current", { packages: ["bar"] });
      google.charts.setOnLoadCallback(drawCol);
      function drawCol() {
        var data = google.visualization.arrayToDataTable(col_payload);

        // set inner height to 30 pixels per row
        var chartAreaHeight = data.getNumberOfRows() * 40;
        // add padding to outer height to accomodate title, axis labels, etc
        var chartHeight = chartAreaHeight + 80;

        var options = {
          height: chartHeight,
          chartArea: {
            height: chartAreaHeight
          },
          chart: {
            title: "Company Performance",
            subtitle: "Costing and Billing"
          }
        };
        var div = document.getElementById("project_cost_billed_chart");
        var chart = new google.charts.Bar(div);
        chart.draw(data, google.charts.Bar.convertOptions(options));
      }

      Swal.close();

      $(window).resize(function() {
        drawBasic();
        drawChart();
        drawPie();
        drawDoughnut();
        drawCol();
        drawTimeline();
      });
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
