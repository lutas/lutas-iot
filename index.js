
var express = require('express');
var config = require('./config');

// modules for IoT data
var weather = require('./weather/weather');
var metro = require('./metro_times/metro');

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


app.listen(config.serverPort, function() {
    console.log("Started application on port " + config.serverPort);
});