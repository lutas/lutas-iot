var moment = require("moment");

function diffDays(lhs, rhs) {
    var dif = lhs - rhs;

    var dayLength = 1000 * 60 * 60 * 24;
    var days = (dif / dayLength);

    return days;
}

module.exports = {
    secondsToMillis: function(val) {
        return val * 1000;
    },

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
            
            case "hoursmins":
                return date.getHours() + ":" + date.getMinutes();

            default:
            case "millis":
                return date.getTime();
        }
    },

    momentFormat: function(date, format) {
        
        return moment(date).format(format);
    },

    getWeeksTill: function(dateString) {

        var fd = dateString.split('-').map(function(val) { return Number(val); });
        var dateTo = new Date(fd[2], fd[1] - 1, fd[0], 12);

        var today = new Date();
        var dateFrom = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 12);

        var days = diffDays(dateTo, dateFrom);   
        var weeks = Math.ceil(days / 7);

        return weeks;  
    },

    getWeeksFrom: function(dateString) {

        var fd = dateString.split('-').map(function(val) { return Number(val); });
        var dateTo = new Date(fd[2], fd[1] - 1, fd[0], 12);

        var today = new Date();
        var dateFrom = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 12);
        
        var days = diffDays(dateFrom, dateTo);   
        var weeks = Math.floor(days / 7);

        return weeks;        
    },

    getDaysTill: function(dateString) {
        var date = moment(dateString, "DD-MM-YYYY");
        
        return diffDays(date, new Date());
    }

};