
module.exports = {

    get: function(req, res) {

        res.header("content-type", "application/json");

        var todayData = weather.getTodaysWeather();
        res.send(JSON.stringify(todayData, null, 4));
    },

    getTodaysWeather: function() {
        return {
            day: new Date(),
            temperatureDegrees: 10,
            description: "Raining",
            image: null
        };
    }

}