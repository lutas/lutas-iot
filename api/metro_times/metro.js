
var config = require('../../config');

var Promise = require('promise');
var http = require('https');

require('array.prototype.find').shim();

console.log(config.metro.location);
console.log(config.metro.apiKey)

const apiDataHost = "maps.googleapis.com";
const apiDataUrl = "/maps/api/directions/json?origin=" + config.metro.location + "&mode=transit&transit_mode=rail&key=" + config.metro.apiKey;

function getMetroTime(data) {

    var directions = JSON.parse(data);

    var leg = directions.routes[0].legs[0];

    var step = leg.steps.find(function(step) {
        return step.travel_mode === "TRANSIT";
    });
    
    return {
        departure_time: step.transit_details.departure_time,
        arrival_time: step.transit_details.arrival_time
    };
}

function getUrl(departureTime) {
    return apiDataUrl + "&departure_time=" + departureTime;
}

function getData(departureTime) {

    return new Promise(function(accept, reject) {

        http.get({
                host: apiDataHost,
                path: getUrl(departureTime)
            }, function(res) {

                var allData = "";

                res.on('data', function(data) {
                    allData += data;
                });

                res.on('end', function() {

                    var result = getMetroTime(allData);

                    accept(result);
                });
        });

    });
}

module.exports = {

    getMinsFromNow: function(req, res) {

        var minsFromNow = Number(req.params.minsFromNow);
        var amount = Number(req.params.amount);
        
        var time = new Date().getTime() + (minsFromNow * 60 * 1000);
        var timeInSecs = Math.floor(time / 1000);

        metro.getNextMetros(timeInSecs, amount).then(function(data) {

            var output = data.map(function(val) {
                var date = new Date(val.departure_time.value * 1000);

                return common.formatDate(date, req.params.format);
            });

            res.header("Content-Type", "applicaton/json");
            res.send(JSON.stringify(output));
        });

    },

    getMetroFrom: function(departureTime) {

        return getData(departureTime);

    },

    getNextMetros: function(departureTime, amount) {
        
        const WaitTimeTillNextMetro = -420; //seconds

        var allTimes = [];
        var self = this;

        function process(data) {

            allTimes.push(data);

            if (allTimes.length == amount) {
                return Promise.resolve(allTimes);
            }

            var newDepartureTime = data.departure_time.value + WaitTimeTillNextMetro;
            var promise = self.getMetroFrom(newDepartureTime).then(process);
            return promise;
        }

        // call promises in series
        return new Promise(function(accept, reject) { 
                     
            self.getMetroFrom(departureTime).then(process).then(function(val) {

                accept(val);
            });
        });
    }

}