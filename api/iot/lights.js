var Wemo = require('wemo-client');
var wemo = new Wemo();

var config = require('../../config');

var Light = function(id, name, deviceIP) {

    isOn = false;

    var client;    
    var loadedPromise = new Promise(function(accept, reject) {

        wemo.load(deviceIP + "/setup.xml", function(deviceInfo) {

            client = wemo.client(deviceInfo);
            client.on('binaryState', function(value) {
                console.log(name + " = " + value);
                isOn = value;
            });
            
            accept(client);
        });
    });

    function changeState(on) {

        return new Promise(function(accept, reject) {
            client.setBinaryState(on, function(err, response) {
                if (err) {
                    console.error("Failed to change light state");
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
        loaded: loadedPromise,
        id: id,

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
                        console.error("Failed to get light state");
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

    new Light(0, "Living Room", config.belkin.livingRoom)

];
