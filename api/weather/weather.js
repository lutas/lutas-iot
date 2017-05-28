
var weather = require('weather-js');

module.exports = {

    get: function(req, res) {

        res.header("content-type", "application/json");

        weather.getTodaysWeather().then(function(data) {
            res.send(JSON.stringify(data, null, 4));
        },
        function(err) {
            res.send(err);
        });
    },

    getTodaysWeather: function() {

        return new Promise(function(accept, reject) {

            weather.find({
                search: "Hebburn, UK",
                degreeType: "C"
            }, function(err, result) {
                if (err) {
                    console.error("Failed to getTodaysWeather");
                    reject(err);
                    return;
                }

                result[0].forecast = result[0].forecast.splice(1, 3);
                result[0].forecast[0].shortday = "Today";
                result[0].forecast[1].shortday = "Tomorrow";

                accept(result[0]);
            });
        });
    }

}