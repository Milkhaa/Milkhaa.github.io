const Covid19IndiaTimeSeriesAPI = 'https://api.covid19india.org/data.json';

//Variables to store parsed data
let dates = [];
let totalconfirmed = [];
let dailyconfirmed = [];

//###################################|Source - https://api.covid19india.org/|######################################
//Make a get call to APIs provided by `https://api.covid19india.org/`
fetch(Covid19IndiaTimeSeriesAPI)
.then(res => res.json())
.then(data=>{
      cases_time_series = data.cases_time_series;
      var len = cases_time_series.length;
      for (var i = 0; i < len; i++){
            cases_time_series_ith = cases_time_series[i];
            dates[i] = cases_time_series_ith.date;
            totalconfirmed[i]= cases_time_series_ith.totalconfirmed;
            dailyconfirmed[i]= cases_time_series_ith.dailyconfirmed;
      }
})

.then( dontgiveafuckaboutthisword =>{

//###################################|Source - https://www.chartjs.org/|######################################
//Plot Chart using data parsed from above API calls
        var ctx = document.getElementById('myCovidCanvasChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: dates,
                datasets: [{
                    showLine: true ,
                    label: 'Total Confirmed Cases',
        //            backgroundColor: 'rgb(255, 255, 255)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: totalconfirmed
                },
                {
                    showLine: true ,
                    label: 'Daily Confirmed Cases',
        //            backgroundColor: 'rgb(255, 255, 255)',
                    borderColor: 'rgb(34, 99, 132)',
                    data: dailyconfirmed
                 }
                ]
            },

            // Configuration options go here
            options: {
                    legend: {
                        labels: {
                            // This more specific font property overrides the global property
                            fontColor: 'green'
                        }
                    },
                    animation: {
                        duration: 0 // general animation time
                    },
                    hover: {
                        animationDuration: 0 // duration of animations when hovering an item
                    },

                }
        });

 })

