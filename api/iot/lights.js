
var PhilipsLight = require('./philipslight');
var BelkinLight = require('./belkinlight');

var config = require('../../config');

module.exports = [

    new BelkinLight(0, "Living Room Lamp", config.belkin.livingRoom),
    new PhilipsLight(1, 2, "Living Room"),
    new PhilipsLight(2, 1, "Our bedroom")

];
