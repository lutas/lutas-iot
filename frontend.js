var api = require('./api/api');
var config = require('./config');

module.exports = function(app, express) {

app.get('/', function(req, res) {
    
    var now = new Date();
    var time = now.getTime();
    var timeInSecs = Math.floor(time / 1000);

    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var todayPlus = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

    Promise.all([
                api.weather.getTodaysWeather(),
                api.metro.getNextMetros(timeInSecs, 3),
                api.calendar.get(config.calendar.icalUrl),
                api.lights[0].loaded
                ])
    .then(function(data) {
        // serve the reporting HTML
        res.render('index', {

            weather: data[0],            
            metrotimes: data[1],
            calendarEvents: data[2].getRecentEvents(today, todayPlus),
            livingRoomLamp: api.lights[0],
            baby: {
                weeksTill: api.common.getWeeksTill(config.datesTo[0]),
                weeksFrom: api.common.getWeeksFrom(config.datesFrom[0])
            }
        });
    });

});

app.get('/metro', function(req, res) {
    var time = new Date().getTime();
    var timeInSecs = Math.floor(time / 1000);

    api.metro.getNextMetros(timeInSecs, 3).then(function(result) {
        res.render('metro', {
            times: result
        });
    });
});

app.get('/light/:lightId', function(req, res) {

    var light = api.lights[req.params.lightId];

    light.isOn().then(function(value) {

        var data = {
            name: light.name,
            value: value
        };

        res.send(data, null, 4);
    });
});

app.get('/light/:lightId/on', function(req, res) {

    api.lights[req.params.lightId].on().then(function(success) {

        res.status(200);
        res.send(success);
    }, function(err) {

        res.status(500);
        res.send(err.message);
    });
});

app.get('/light/:lightId/off', function(req, res) {

    api.lights[req.params.lightId].off().then(function(success) {

        res.status(200);
        res.send(success);
    }, function(err) {

        res.status(500);
        res.send(err.message);
    });
});

}