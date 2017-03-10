var exphbs = require('express-handlebars');
var path = require('path');
var api = require('./api/api');

var config = require('./config');

module.exports = function(app, express) {

app.engine('.hbs', exphbs({defaultLayout: 'single', extname: '.html'}));
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, 'public')));
    
app.get('/', function(req, res) {
    // serve the reporting HTML
    res.render('index');
});

app.get('/metro', function(req, res) {
    var time = new Date().getTime();
    var timeInSecs = Math.floor(time / 1000);

    api.metro.getNextMetros(timeInSecs, 3).then(function(result) {
        res.render('metro', {
            times: result
        });
    });
});

app.get('/running', function(req, res) {

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

}