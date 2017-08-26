
var Wemo = require('wemo-client');
var PhilipsLight = require('./philipslight');
var BelkinLight = require('./belkinlight');
var config = require('../../config');

let lights = [
    new PhilipsLight(0, 2, "Living Room"),
    new PhilipsLight(1, 1, "Our bedroom"),
    new PhilipsLight(2, 3, "Office"),
    new PhilipsLight(3, 4, "Kitchen")
];

let wemo = new Wemo();

let index = lights.length;
// discover Belkin lights
wemo.discover(function(deviceInfo) {

    // if is light
    if (deviceInfo) {
        let url = 'http://' + deviceInfo.host + ':' + deviceInfo.port;

        lights.push(new BelkinLight(index, deviceInfo.friendlyName, url));
        ++index;
    }
});

module.exports = lights;
