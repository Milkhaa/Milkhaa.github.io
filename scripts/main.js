const Covid19IndiaTimeSeriesAPI = 'https://api.covid19india.org/data.json';
const Covid19IndianStatesDailyAPI = 'https://api.covid19india.org/states_daily.json';
const Covid19IndiaNews = "https://api.smartable.ai/coronavirus/news/IN"

//Variables to store parsed data
let dates = [];
let totalconfirmed = [];
let dailyconfirmed = [];

//1.National cases###################################|Source - https://api.covid19india.org/|######################################
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
                    layout: {
                        padding: {
                            left: 100,
                            right: 100,
                            top: 100,
                            bottom: 0
                        }
                    },
                    title: {
                        display: true,
                        text: 'India Coronavirus Timelines',
                        fontColor:'red'
                     }

                }
        });

 })


//2.statewise cases###################################|Source - https://api.covid19india.org/|######################################
let stateToCasesMap = new Map()

fetch(Covid19IndianStatesDailyAPI)
.then(res => res.json())
.then(data=>{
      states_daily = data.states_daily;
      let states_daily_confirmed = states_daily.filter(json => {
        return json.status === "Confirmed";
      })

      var len = states_daily_confirmed.length;
      for (var i = 0; i < len; i++){
            var json = states_daily_confirmed[i];
            for(var key in json){
                if (key ==="status" || key ==="date")
                    continue

                keyCap = key.toUpperCase()
                if (stateToCasesMap.has("IN-"+keyCap)){
                    let jsonCurrValue = parseInt(json[key]);
                    if (!isNaN(jsonCurrValue)){//Ignore errors in the API response data e.g " "
                        stateToCasesMap.set("IN-"+keyCap,stateToCasesMap.get("IN-"+keyCap)+ jsonCurrValue)
                    }
                }else{
                    stateToCasesMap.set("IN-"+keyCap,parseInt(json[key]))
                }
            }
      }
})

.then( againdontgiveafuckaboutthisword =>{

    const indiaTotal = stateToCasesMap.get("IN-TT")
    totalDiv = document.getElementById('total');
    totalDiv.innerHTML = "WARNING: India Total is "+indiaTotal.toString();

    stateToCasesMap.delete("IN-TT");//remove total from map
    var stateToCasesListItr =  Array.from( stateToCasesMap.keys() ) .map(function (key) {
        return [key,stateToCasesMap.get(key)];
    });


    const stateToCasesList = Array.from(stateToCasesListItr)
    const stateToCasesListWithHeader = [['State Code','Total Confirmed Positive Cases']].concat(stateToCasesList)

//###################################|Source - www.gstatic.com |######################################
    google.load('visualization', '1', {'packages': ['geochart']});
    google.setOnLoadCallback(drawVisualization);

    function drawVisualization() {
      var data = google.visualization.arrayToDataTable(stateToCasesListWithHeader);
      var opts = {
        region: 'IN',
        domain : 'IN',//Kashmir issue from india perspective
        displayMode: 'regions',
        resolution: 'provinces',
        width: 640,
        height: 480,
        colorAxis: {colors: ["white","ffdfbf", "fed8b1", "orange","FF8C00","red","maroon"]},
        backgroundColor: '#81d4fa'
      };
      var geochart = new google.visualization.GeoChart(
          document.getElementById('visualization'));
      geochart.draw(data, opts);
    };
});

//#############################
let galleryElems = []
fetch(Covid19IndiaNews,
{
  headers: {
    'Subscription-Key': '3009d4ccc29e4808af1ccc25c69b4d5d'
  }
})
.then(res => res.json())
.then(data=>{
      news_arr = data.news;
      var len = news_arr.length;
      for (var i = 0; i < len; i++){
            let title = news_arr[i].title;
            let excerpt = news_arr[i].excerpt;
            let webUrl = news_arr[i].webUrl;
            let publishedDateTime = news_arr[i].publishedDateTime;

            let images = news_arr[i].images;
            let imageUrl = null;
            if (images !== null && images.length > 0){
                imageUrl = images[0].url;
            }

            let modifiedtitle =  publishedDateTime+ " : " + title;
           let elem = {};
           if (imageUrl === null){
                elem = {
                    'href': webUrl,
                    'type': 'external',
                   'title': title,
                   'description': excerpt,
                }
           }else{
                elem = {
                     'href': imageUrl,
                     'type': 'image',
                     'title': title,
                     'description': excerpt,
                }
           }
            galleryElems.push(elem);

      }
})

.then( sayingagaindontgiveafuckaboutthisword =>{

//#############################
    const myGallery = GLightbox({
        elements : galleryElems,
        autoplayVideos: true,
    });

    let newsButton = document.getElementById('india-news');
    newsButton.onclick = function(){myGallery.open();};


});