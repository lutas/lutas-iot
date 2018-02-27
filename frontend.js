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
        debugPromise('lights', allLightsLoaded),
        debugPromise('verium', api.verium.get())
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
                weeksFrom: api.common.getWeeksFrom(config.datesFrom[0]),
                weeksOld: api.common.getWeeksFrom(config.datesFrom[1])
            },
            verium: data[4]
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


app.get('/verium', function(req, res) {
    
    api.verium.get().then(function(data) {

        res.render('verium', {
            page: 'Verium',
            verium: data
        });
    }, handleError.bind(res));
});

app.get('/verium/basicdata', function(req, res) {

    api.verium.get().then(data => {        
        res.status(200);
        res.send({  
            vrm_gbp: Number(data.vrm.price_gbp).toFixed(2),
            vrc_gbp: Number(data.vrc.price_gbp).toFixed(2),
            confirmed: Number(data.balance.confirmed).toFixed(7),
            pending: Number(data.balance.unconfirmed).toFixed(7)
        });
    }, err => {
        res.status(500);
        res.send(err.message);
    })
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

        var data = {
            name: light.name,
            isOn: value.state.on,
            reachable: value.state.reachable
        };

        res.send(data, null, 4);
    }, handleError.bind(res));
});

app.get('/light/:lightId/on', function(req, res) {

    const error = function(err) {
        res.status(500);
        res.send(err.message);
    };

    var data = api.lights[req.params.lightId].isOn().then(function(info) {
        if (info.state.reachable) {

            api.lights[req.params.lightId].on().then(function(success) { 
                
                success[0].reachable = true;
                res.status(200);
                res.send(success);
            }, error)
            .catch(error);
        } else {

            res.status(200);
            res.send([{
                reachable: false          
            }]);
        }
    },
    error);
});

app.get('/light/:lightId/off', function(req, res) {

    const error = function(err) {
        res.status(500);
        res.send(err.message);
    };

    var data = api.lights[req.params.lightId].isOn().then(function(info) {
        if (info.state.reachable) {

            api.lights[req.params.lightId].off().then(function(success) { 
                
                success[0].reachable = true;
                res.status(200);
                res.send(success);
            }, error)
            .catch(error);
        } else {

            res.status(200);
            res.send([{
                reachable: false          
            }]);
        }
    },
    error);
});

}
