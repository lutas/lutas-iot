var api = require('./api/api');
var config = require('./config');

module.exports = function(app, express) {

    var downloadData = function() {

        return new Promise(function(accept, reject) {

            var today = new Date();
            var data = {};

            api.running.login({
                emailAddress: config.running.login,
                password: config.running.password
            })
            .then(function() {

                api.running.getMonthActivities(today.getMonth() + 1, today.getFullYear())
                .then(function(activities) {

                    data.activities = activities;

                    api.running.downloadActivity(activities[0][0])
                    .then(function(lastRunData) {

                        data.lastRun = lastRunData;
                        accept(data);
                    }, reject);
                }, reject);
            }, reject);
        });        
    }

    app.get('/running', function(req, res) {
        
        downloadData().then(function(data) { 

            res.render('running', data);
        }, function(err) {
            
            res.render('error', {
                title: "Failed to login to Runtastic",
                message: err.message || err
            });
        });
    });
    
    app.get('/running/:activityid', function(req, res) {

        api.running.login({
            emailAddress: config.running.login,
            password: config.running.password
        }).then(function() {
            api.running.downloadActivity(req.params.activityid)
                .then(function(data) { 
                    api.running.logout();

                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(data, null, 4));
                }, function(err) {
                    res.send(err.message);
                });

        });
    });

    app.get('/running/month/:month/:year', function(req, res) {

        api.running.login({
            emailAddress: config.running.login,
            password: config.running.password
        }).then(function() {
            api.running.getMonthStats(Number(req.params.month), Number(req.params.year))
                .then(function(data) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(data));
                }, function(err) {
                    res.send(err.message);
                });
        });
    });

};