
var Wemo = require('wemo-client');
var PhilipsLight = require('./philipslight');
var BelkinLight = require('./belkinlight');
var config = require('../../config');

let lights = [
    new PhilipsLight(0, 2, "Living Room"),
    new PhilipsLight(1, 1, "Our bedroom"),
    new PhilipsLight(2, 3, "Office"),
    new PhilipsLight(3, 4, "Kitchen"),
    new PhilipsLight(4, 5, "Landing")
];

let wemo = new Wemo();

let index = lights.length;
// discover Belkin lights
console.log('Scanning for Wemo devices');

let belkinLights = {};
wemo.discover(function(err, deviceInfo) {

    // if the device is a compatible light or lightswitch
    if (deviceInfo.deviceType == Wemo.DEVICE_TYPE.Switch) {

        let url = 'http://' + deviceInfo.host + ':' + deviceInfo.port;

        // if this light already exists then replace it, otherwise create a new index
        let existingIndex = belkinLights[deviceInfo.friendlyName];
        console.log('Setting Belkin light:', deviceInfo.friendlyName, 'to', existingIndex || index);
        if (existingIndex) {
            lights[existingIndex] = new BelkinLight(existingIndex, deviceInfo.friendlyName, url);
        } else {            
            lights.push(new BelkinLight(index, deviceInfo.friendlyName, url));
            belkinLights[deviceInfo.friendlyName] = index;
            ++index;
        }
    }
});

module.exports = lights;
