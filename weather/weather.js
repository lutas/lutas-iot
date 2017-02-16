
module.exports = {

    getTodaysWeather() {
        return {
            day: new Date(),
            temperatureDegrees: 10,
            description: "Raining",
            image: null
        };
    }

}