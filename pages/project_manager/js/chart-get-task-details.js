/*////////////////////////////////////

Display tasks in donut chart

*/////////////////////////////////////
var ctx = document.getElementById("myPieChart");
var myPieChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ["Tasks Completed", "Tasks Left to do", "Tasks being done"],
    datasets: [{
      data: [55, 30, 15],
      backgroundColor: ['#1cc88a ', '#e74a3b ', '#f6c23e'],
      hoverBackgroundColor: ['#81CCB2', '#FF968B', '#FFD467'],
      hoverBorderColor: "rgba(234, 236, 244, 1)",
    }],
  },
  options: {
    maintainAspectRatio: false,
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      caretPadding: 10,
    },
    legend: {
      display: false
    },
    cutoutPercentage: 80,
  },
});