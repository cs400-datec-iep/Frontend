var Total_Staff;
var Total_PM;
var Total_Management;
var total_users;
var active_management;
var active_PM;
var active_Staff;


$(document).ready(function () {

    token = sessionStorage.getItem("token");
    var urlGetTotal = 'https://datectestapi.azurewebsites.net/api/GetCountRole/';
    var urlGetActive_Status = 'https://datectestapi.azurewebsites.net/api/GetActiveUserMain/'


    // generate random number loop
    function randomNum() {
        "use strict";
        return Math.floor(Math.random() * 9) + 1;
    }

    var loop1, loop2, loop3, loop4, time = 30, i = 0, speed = 100,
        selector4 = document.querySelector('#Number_of_Staff'),
        selector3 = document.querySelector('#Number_of_PM'),
        selector2 = document.querySelector('#Number_of_Management'),
        selector1 = document.querySelector('#Number_of_User');


    //Get table count data staff
    fetch(urlGetTotal + "Staff", {
        async: false,
        method: 'GET',
        crossDomain: true,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(function (a) { return a.json() })
        .then(function (s) {
            Total_Staff = s;

            loop4 = setInterval(function () {
                "use strict";
                if (i > 40) {
                    clearInterval(loop4);
                    selector4.textContent = s;
                } else {
                    selector4.textContent = randomNum();
                    i++;
                }
            }, time);

            //////////////////////////////////////////////////////////////          
            //Get table count data Project manager
            fetch(urlGetTotal + "Project Manager", {
                async: false,
                method: 'GET',
                crossDomain: true,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(function (a) { return a.json() })
                .then(function (pm) {
                    Total_PM = pm

                    loop3 = setInterval(function () {
                        "use strict";
                        if (i > 80) {
                            clearInterval(loop3);
                            selector3.textContent = pm;
                        } else {
                            selector3.textContent = randomNum();
                            i++;
                        }
                    }, time);
                })
                .catch(error => { console.error('Error:', error); return error; });

            ////////////////////////////////////////////////////////////// 
            //Get table count data Management
            fetch(urlGetTotal + "Management", {
                async: false,
                method: 'GET',
                crossDomain: true,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(function (a) { return a.json() })
                .then(function (m) {
                    Total_Management = m;

                    loop2 = setInterval(function () {
                        "use strict";
                        if (i > 60) {
                            clearInterval(loop2);
                            selector2.textContent = m;
                        } else {
                            selector2.textContent = randomNum();
                            i++;
                        }
                    }, time);

                })
                .catch(error => { console.error('Error:', error); return error; });


            ////////////////////////////////////////////////////////////// 
            //Get Number of user status based on role
            //fetch active managers
            fetch(urlGetActive_Status + "management", {
                async: false,
                method: 'GET',
                crossDomain: true,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).then(function (a) { return a.json() })
                .then(function (management) {
                    active_management = management;

                    //fetch active Project managers
                    fetch(urlGetActive_Status + "Project Manager", {
                        async: false,
                        method: 'GET',
                        crossDomain: true,
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    }).then(function (a) { return a.json() })
                        .then(function (PM) {
                            active_PM = PM;

                            //fetch active Staff
                            fetch(urlGetActive_Status + "Staff", {
                                async: false,
                                method: 'GET',
                                crossDomain: true,
                                headers: {
                                    'Authorization': 'Bearer ' + token
                                }
                            }).then(function (a) { return a.json() })
                                .then(function (Staff) {
                                    active_Staff = Staff;

                                    total_users = (parseInt(Total_Management) + parseInt(Total_PM) + parseInt(Total_Staff));

                                    loop1 = setInterval(function () {
                                        "use strict";
                                        if (i > speed) {
                                            clearInterval(loop1);
                                            selector1.textContent = total_users;
                                        } else {
                                            selector1.textContent = randomNum();
                                            i++;
                                        }
                                    }, time);

                                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                    // Set new default font family and font color to mimic Bootstrap's default styling
                                    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
                                    Chart.defaults.global.defaultFontColor = '#858796';

                                    function number_format(number, decimals, dec_point, thousands_sep) {
                                        // *     example: number_format(1234.56, 2, ',', ' ');
                                        // *     return: '1 234,56'
                                        number = (number + '').replace(',', '').replace(' ', '');
                                        var n = !isFinite(+number) ? 0 : +number,
                                            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
                                            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
                                            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
                                            s = '',
                                            toFixedFix = function (n, prec) {
                                                var k = Math.pow(10, prec);
                                                return '' + Math.round(n * k) / k;
                                            };
                                        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
                                        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
                                        if (s[0].length > 3) {
                                            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
                                        }
                                        if ((s[1] || '').length < prec) {
                                            s[1] = s[1] || '';
                                            s[1] += new Array(prec - s[1].length + 1).join('0');
                                        }
                                        return s.join(dec);
                                    }


                                    // Generate user graph

                                    var activeTotal = parseInt(active_management) + parseInt(active_PM) + parseInt(active_Staff);

                                    // get number of users
                                    var InactiveTotal = total_users - activeTotal;
                                    var InactiveStaff = Total_Staff - active_Staff;
                                    var InactivePm = Total_PM - active_PM;
                                    var InactiveManagement = Total_Management - active_management;

                                    //Generate Chart For User Status
                                    var ctx = document.getElementById('statusBarChart');
                                    var myChart = new Chart(ctx, {
                                        type: 'bar',
                                        data: {
                                            labels: ["Total", "Mangement", "Project Managers", "Staff"],
                                            datasets: [{
                                                label: 'Active Users',
                                                data: [activeTotal, active_management, active_PM, active_Staff],
                                                backgroundColor: [
                                                    '#1cc88a',
                                                    '#1cc88a',
                                                    '#1cc88a',
                                                    '#1cc88a',
                                                ],
                                                borderWidth: 2
                                            },
                                            {
                                                label: 'Inactive Users',
                                                data: [InactiveTotal, InactiveManagement, InactivePm, InactiveStaff],
                                                backgroundColor: [
                                                    '#e74a3b',
                                                    '#e74a3b',
                                                    '#e74a3b',
                                                    '#e74a3b',
                                                ],
                                                borderWidth: 2
                                            }
                                            ]
                                        },
                                        options: {
                                            maintainAspectRatio: false,
                                            layout: {
                                                padding: {
                                                    left: 10,
                                                    right: 25,
                                                    top: 25,
                                                    bottom: 0
                                                }
                                            },
                                            scales: {
                                                yAxes: [{
                                                    stacked: true,
                                                    time: {
                                                        unit: 'User Type'
                                                    },
                                                    gridLines: {
                                                        display: false,
                                                        drawBorder: false
                                                    },
                                                    ticks: {
                                                        beginAtZero: true
                                                    },
                                                    maxBarThickness: 25,
                                                }],
                                                xAxes: [{
                                                    stacked: true,
                                                    ticks: {
                                                        beginAtZero: true
                                                    },
                                                    gridLines: {
                                                        color: "rgb(234, 236, 244)",
                                                        zeroLineColor: "rgb(234, 236, 244)"
                                                    }
                                                }]
                                            },
                                            legend: {
                                                display: false
                                            },
                                            tooltips: {
                                                titleMarginBottom: 10,
                                                titleFontColor: '#6e707e',
                                                titleFontSize: 14,
                                                backgroundColor: "rgb(255,255,255)",
                                                bodyFontColor: "#858796",
                                                borderColor: '#dddfeb',
                                                borderWidth: 1,
                                                xPadding: 15,
                                                yPadding: 15,
                                                displayColors: false,
                                                caretPadding: 10,
                                                callbacks: {
                                                    label: function (tooltipItem, chart) {
                                                        var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                                                        return datasetLabel + ':' + number_format(tooltipItem.yLabel);
                                                    }
                                                }
                                            },
                                        }
                                    });
                                    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                                    // var load = document.getElementById("load");
                                    // var container = document.getElementById("container");
                                    // load.classList.add('display-none');
                                    // container.classList.remove('display-none');
                                    // container.classList.add('display-inline-block');


                                }).catch(error => { console.error('Error:', error); return error; });

                        })
                        .catch(error => { console.error('Error:', error); return error; });

                }).catch(error => { console.error('Error:', error); return error; });

        }).catch(error => { console.error('Error:', error); return error; });

});


