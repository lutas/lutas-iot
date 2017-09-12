
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
console.log('Scanning for Wemo devices');
wemo.discover(function(err, deviceInfo) {

    function getIndexFor(friendlyName) {
        for (let i = 0; i < lights.length; ++i) {
            if (lights[i].friendlyName == friendlyName) {
                return i;
            }
        }

        return null;
    }

    // if is light
    if (deviceInfo.deviceType == Wemo.DEVICE_TYPE.Switch) {

        let url = 'http://' + deviceInfo.host + ':' + deviceInfo.port;

        // if this light already exists then replace it, otherwise create a new index
        let existingIndex = getIndexFor(deviceInfo.friendlyName);
        console.log('Adding Belkin light:', deviceInfo.friendlyName);
        if (existingIndex) {
            lights[existingIndex] = new BelkinLight(existingIndex, deviceInfo.friendlyName, url);
        } else {            
            lights.push(new BelkinLight(index, deviceInfo.friendlyName, url));
            ++index;
        }
    }
});

module.exports = lights;
