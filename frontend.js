var api = require('./api/api');
var config = require('./config');

var handleError = function(err) {

    console.error(err.message || err);

    this.render('error', {
        title: "Failed getting information for frontend",
        message: err.message || err
    });
};

var debugPromise = function(msg, promise) {
    return new Promise((accept, reject) => {

        console.log('Starting', msg);
        promise.then(res => {
            console.log('Finished', msg);
            accept(res);
        }, res => {
            console.log('Failed', msg);
            reject(res);
        });
    });
}

module.exports = function(app, express) {

app.get('/', function(req, res) {

    console.log("Loading page");
    
    var now = new Date();
    var time = now.getTime();
    var timeInSecs = Math.floor(time / 1000);

    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var todayPlus = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);

    var lightPromises = api.lights.map(light => debugPromise('Loading light: ' + light.name, light.loaded));
    console.log('Waiting for', lightPromises.length, 'lights');
    var allLightsLoaded = Promise.all(lightPromises);

    Promise.all([
        debugPromise('weather', api.weather.getTodaysWeather()),
        debugPromise('metro', api.metro.getNextMetros(timeInSecs, 3)),
        debugPromise('calendar', api.calendar.get(config.calendar.icalUrl)),
        debugPromise('lights', allLightsLoaded)
                ])
    .then(function(data) {
        // serve the reporting HTML
        res.render('index', {

            page: 'Home',
            weather: data[0],            
            metrotimes: data[1],
            calendarEvents: data[2].getRecentEvents(today, todayPlus),
            lights: api.lights,
            baby: {
                weeksTill: api.common.getWeeksTill(config.datesTo[0]),
                weeksFrom: api.common.getWeeksFrom(config.datesFrom[0])
            }
        });
    }, handleError.bind(res))
    .catch(e => {
        console.error("Error loading page " + e.message);
        handleError(e).bind(res);
    });

});

app.get('/metro', function(req, res) {
    var time = new Date().getTime();
    var timeInSecs = Math.floor(time / 1000);

    api.metro.getNextMetros(timeInSecs, 3).then(function(result) {
        res.render('metro', {
            page: 'Metro',
            times: result
        });
    }, handleError.bind(res));
});

app.get('/lights', function(req, res) {

    Promise.all(api.lights.map(light => light.loaded)).then(function() {
        
        res.render('lights', {

            page: 'Lights',
            lights: api.lights
        });
    }, handleError.bind(res))
    .catch(e => {
        handleError(e);
    });
})

app.get('/light/:lightId', function(req, res) {

    var light = api.lights[req.params.lightId];

    light.isOn().then(function(value) {

        var isOn;
        var isReachable;

        if (value.hasOwnProperty("state")) {
            // philips light
            isOn = value.state.on;
            isReachable = value.state.reachable;
        } else {
            // belkin light
            isOn = value != 0;
            isReachable = true;
        }

        var data = {
            name: light.name,
            isOn: isOn,
            reachable: isReachable
        };

        res.send(data, null, 4);
    }, handleError.bind(res));
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
    })
    .catch(function(err) {

        res.status(500);
        res.send(err.message);
    });
});

}