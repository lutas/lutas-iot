
var express = require('express');
var config = require('./config');

// modules for IoT data
var weather = require('./weather/weather');
var metro = require('./metro_times/metro');
var common = require('./common/common');

var app = express();

app.get('/', function(req, res) {
    // serve the reporting HTML
});

app.get('/weather', function(req, res) {

    res.header("content-type", "application/json");

    var todayData = weather.getTodaysWeather();
    res.send(JSON.stringify(todayData, null, 4));
});

app.get('/metro/:minsFromNow', function(req, res) {

    var minsFromNow = Number(req.params.minsFromNow);

    var time = new Date().getTime() + (minsFromNow * 60 * 1000);
    var timeInSecs = Math.floor(time / 1000);

    metro.getMetroFrom(timeInSecs).then(function(data) {
        res.header("Content-Type", "application/json");
        res.send(JSON.stringify(data, null, 4));
    });
});

app.get('/metro/:minsFromNow/:amount', function(req, res) {
    
    var minsFromNow = Number(req.params.minsFromNow);
    var amount = Number(req.params.amount);
    
    var time = new Date().getTime() + (minsFromNow * 60 * 1000);
    var timeInSecs = Math.floor(time / 1000);

    metro.getNextMetros(timeInSecs, amount).then(function(data) {
        res.header("Content-Type", "applicaton/json");
        res.send(JSON.stringify(data));
    });

});

app.get('/metro/departures/:minsFromNow/:amount', function(req, res) {

    var minsFromNow = Number(req.params.minsFromNow);
    var amount = Number(req.params.amount);
    
    var time = new Date().getTime() + (minsFromNow * 60 * 1000);
    var timeInSecs = Math.floor(time / 1000);

    metro.getNextMetros(timeInSecs, amount).then(function(data) {

        var output = data.map(function(val) {
            var date = new Date(val.departure_time.value * 1000);

            return common.formatDate(date, "timedigits");
        });

        res.header("Content-Type", "applicaton/json");
        res.send(JSON.stringify(output));
    });

});

app.get("/time/:format", function(req, res) {

    var output = common.formatDate(new Date(), req.params["format"]);

    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(output));
});


app.listen(config.serverPort, function() {
    console.log("Started application on port " + config.serverPort);
});