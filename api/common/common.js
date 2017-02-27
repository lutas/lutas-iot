var moment = require("moment");

function diff(lhs, rhs) {
    var dif = lhs - rhs;
    var weeks = Math.floor(dif/1000/60/60/24/7);

    return weeks;
}

module.exports = {
    formatDate: function(date, format) {

        switch (format) {
            case "timedigits":
                return [
                    Math.floor(date.getHours() / 10),
                    date.getHours() % 10,
                    Math.floor(date.getMinutes() / 10),
                    date.getMinutes() % 10
                ];

            case "minsFromNow":
                {
                    var diffMs = (date - new Date());
                    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes

                    return diffMins;
                }

            case "datedigits":
                return [
                    Math.floor(date.getDate() / 10),
                    date.getDate() % 10,
                    Math.floor((date.getMonth() + 1) / 10),
                    (date.getMonth() + 1) % 10,
                    Math.floor((date.getYear() - 100) / 10),
                    (date.getYear() - 100) % 10
                ];

            default:
            case "millis":
                return date.getTime();
        }
    },

    getWeeksTill: function(dateString) {

        var fd = dateString.split('-').map(function(val) { return Number(val); });
        var dateTo = new Date(fd[2], fd[1] - 1, fd[0], 23, 59);

        var today = new Date();
        var dateFrom = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

        return diff(dateTo.valueOf(), dateFrom.valueOf());        
    },

    getWeeksFrom: function(dateString) {

        var fd = dateString.split('-').map(function(val) { return Number(val); });
        var dateTo = new Date(fd[2], fd[1] - 1, fd[0]);

        var today = new Date();
        var dateFrom = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

        return diff(dateFrom.valueOf(), dateTo.valueOf());        
    },

    getDaysTill: function(dateString) {
        var date = moment(dateString, "DD-MM-YYYY");

        var dif = date.valueOf() - new Date();
        var days = Math.round(dif/1000/60/60/24);

        return days;
    }

};