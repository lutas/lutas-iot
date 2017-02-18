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
    }
}