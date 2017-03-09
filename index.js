
var express = require('express');
var config = require('./config');

// modules for IoT data
var weather = require('./api/weather/weather');
var metro = require('./api/metro_times/metro');
var common = require('./api/common/common');
var fs = require('fs');

if (!fs.existsSync('./cache')) {
    fs.mkdirSync('./cache');
}

var app = express();

require('./frontend')(app, express);

app.get('/weather', weather.get);

app.get('/metro/departures/:minsFromNow/:amount/:format', metro.getMinsFromNow);

app.get("/time/:format", function(req, res) {

    var output = common.formatDate(new Date(), req.params["format"]);

    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(output));
});

app.get("/weekstill/:date/", function(req, res) {

    if (!isNaN(req.params.date)) {
        req.params.date = config.datesTo[req.params.date];
    }

    var output = common.getWeeksTill(req.params.date);

    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(output));
});

app.get("/weeksfrom/:date/", function(req, res) {

    if (!isNaN(req.params.date)) {
        req.params.date = config.datesFrom[req.params.date];
    }

    var output = common.getWeeksFrom(req.params.date);

    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(output));
});


app.listen(config.serverPort, function() {
    console.log("Started application on port " + config.serverPort);
});