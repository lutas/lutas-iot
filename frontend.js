var exphbs = require('express-handlebars');
var path = require('path');
var api = require('./api/api');

module.exports = function(app, express) {

app.engine('.hbs', exphbs({defaultLayout: 'single', extname: '.html'}));
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, 'public')));
    
// download page data

var time = new Date().getTime();
var timeInSecs = Math.floor(time / 1000);

var data = {};

api.metro.getNextMetros(timeInSecs, 3).then(function(result) {
    data.metro = result;
});


app.get('/', function(req, res) {
    // serve the reporting HTML
    res.render('index', data);
});

};