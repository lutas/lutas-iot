'use strict';

var Runtastic = require('runtastic-js');
var Promise = require('promise');

var activityCache = require('./activityCache');

function flatten(activities) {
    return activities.reduce(function(prev, val) {
        prev = prev || [];
        if (val) {
            for (var index = 0; index < val.length; ++index) {
                prev.push(val[index]);
            }
        }
        return prev;
    });
}

function downloadActivity(api, activityId) {

    var activityReceivedPromise = new Promise(function(individualActivityAccept, individualActivityReject) {

        // if we've already downloaded this activity then return that
        var cachedData = activityCache.getActivity(activityId);
        if (cachedData) {
            individualActivityAccept(cachedData);
            return;
        }

        api.fetchActivityDetails(activityId, false, function(err, activity) {

            if (err) {
                // expected that some might fail to retrieve but this is fine
                individualActivityAccept(false);
            }
            else {
                var attrib = activity.data.attributes;
                attrib.activityId = activityId;
                attrib.ext_data = undefined;
                attrib.fastest_paths = undefined;
                attrib.workout_data = undefined;
                attrib.zones = undefined;
                attrib.current_training_plan_state = undefined;

                activityCache.cache(activityId, attrib);
                individualActivityAccept(attrib);
            }
        });
    });

    return activityReceivedPromise;
}

module.exports = {

    api: null,

    metresToMiles: function(metres) {
        return Math.round((metres / 1000) / 1.6 * 100) / 100;
    },
    
    login: function(config) {

        var self = this;
        var loginPromise = new Promise(function(accept, reject) {           

            self.api = new Runtastic(config.emailAddress, config.password);
            self.api.login(function(err, user) {
                if (err) {
                    console.error("Failed to login to runtastic");
                    reject(err);
                } 
                else {
                    self.user = user;
                    accept(user);
                }
            });
        });

        return loginPromise;
    },

    logout: function() {
        this.api.logout();
    },

    downloadActivity: function(activityId) {
        return downloadActivity(this.api, activityId);
    },

    getMonthActivities: function(month, year) {

        var from = year + '/' + month + '/01';
        var to = year + '/' + month + '/31';

        var api = this.api;

        var completedPromise = new Promise(function(completedAccept, completedReject) {
            api.fetchActivities(30, {
                'from': new Date(from), 
                'to': new Date(to)
            }, function(err, activities) {

                if (err) {
                    console.error("Failed to get this month's running activities");
                    console.error(err);
                    completedReject(err);
                    return;
                }

                completedAccept(activities.filter(function(val) {
                     return val != null;
                }));
            })
        });

        return completedPromise;
    },

    getMonthStats: function(month, year) {

        var from = year + '/' + month + '/01';
        var to = year + '/' + month + '/31';

        var api = this.api;

        var completedPromise = new Promise(function(completedAccept, completedReject) {
            api.fetchActivities(50, {'from': new Date(from), 'to': new Date(to)}, function(err, activities) {

                if (err) {
                    console.error("Failed to retrieve running monthstats");
                    completedReject(err);
                    return;
                }
               
                // flatten the activity ID's as they come back as array of arrays
                var flattened = flatten(activities);
                console.log("Month: " + month + "/" + year + " - found " + flattened.length + " activities");
        
                var activitiesReceived = [];
                var allDetails = [];

                var initialPromise = new Promise(function(accept) { accept(); });

                var allReceived = flattened.reduce(function(promise, activityId, index) {
                    return promise.then(function(data) {
                        if (data) {                                
                            allDetails.push(data);
                        }
                        return downloadActivity(api, activityId);
                    });
                }, initialPromise);

                allReceived.then(function() {
                    completedAccept({ monthIndex: month - 1, details: allDetails });
                }, function(err) {
                    completedReject(err);
                })
                .catch(function(reason) {
                    throw reason;
                });
            });            
        });

        return completedPromise;
    }
};