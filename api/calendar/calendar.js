var config = require('../../config');
var download = require('../common/download-https');
var ical = require('node-ical');
var moment = require('moment');
require('moment-timezone');

var Calendar = function(result) {

    var data = ical.parseICS(result);
    
    var events = [];
    for (k in data) {
        if (data.hasOwnProperty(k) && data[k].hasOwnProperty("summary")) {
            // cache flattened startTime for later sorting

            data[k].start = moment.utc(data[k].start).tz("Europe/London").format();
            data[k].end = moment.utc(data[k].end).tz("Europe/London").format();

            data[k].startTime = new Date(data[k].start).getTime();
            events.push(data[k]);
        }
    }

    return {

        getRecentEvents: function(start, end) {
            
            var filtered = events.reduce(function(prev, val) {

                if (val.startTime >= start && val.startTime < end) {
                    prev.push(val);
                }
                return prev;
            }, []);

            filtered.sort(function(a, b) { 
                return a.startTime - b.startTime;
            });

            return filtered;
        }
    };
};

module.exports = {

    get: function(url) {

        return new Promise(function(accept, reject) {

            download(url).then(function(result) {

                var calendar = new Calendar(result);
                accept(calendar);
            }, reject);
        });
    }
};
