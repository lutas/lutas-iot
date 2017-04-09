var Wemo = require('wemo-client');
var wemo = new Wemo();

var config = require('../../config');

var Light = function(name, deviceIP) {

    isLoaded = false;
    isOn = false;

    var client;
        
    wemo.load(deviceIP + "/setup.xml", function(deviceInfo) {

        client = wemo.client(deviceInfo);
        client.on('binaryState', function(value) {
            console.log(name + " = " + value);
            isOn = value;
        });

        isLoaded = true;
    });

    function changeState(on) {

        return new Promise(function(accept, reject) {
            client.setBinaryState(on, function(err, response) {
                if (err) {
                    reject(err);
                }
                else {
                    accept(response);
                }
            });
        });
    }

    return {
        name: name,
        isLoaded: isLoaded,

        on: function() {
            return changeState(1);
        },

        off: function() {
            return changeState(0);
        },

        isOn: function() {
            return new Promise(function(accept, reject) {

                client.getBinaryState(function(err, state) {
                    if (err) {
                        reject(err);
                    } else {
                        accept(state);
                    }                
                })
            });
        }
    };
};


module.exports = [

    new Light("Living Room", config.belkin.livingRoom)

];
