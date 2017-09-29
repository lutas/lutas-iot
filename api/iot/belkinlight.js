var Wemo = require('wemo-client');

var wemo = new Wemo();

var config = require('../../config');

var Light = function(id, name, deviceIP) {

    isOn = false;

    var client;    
    var loadedPromise = new Promise(function(accept, reject) {
        
        var timeoutId = setTimeout(() => {
            console.log('Timeout waiting for Belkin light', name);
            accept('Failed to connect to Wemo light');
        }, 3000);

        console.log('Wemo connecting to', name);
        wemo.load(deviceIP + "/setup.xml", function(err, deviceInfo) {

            if (err) {
                console.log('Wemo failed to connect', name);
                reject(err);
                return;
            }
            
            client = wemo.client(deviceInfo);
            client.on('binaryState', function(value) {
                console.log(name + " = " + value);
                isOn = value;
            });

            clearTimeout(timeoutId);
            
            console.log('Wemo connected to', name);
            accept(client);
        });
    });

    function changeState(on) {

        if (!client) {
            return Promise.reject('Failed to change light');
        }

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
            if (!client) {
                return Promise.resolve({
                    state: { isOn: false, reachable: false }
                });
            }

            return new Promise(function(accept, reject) {

                client.getBinaryState(function(err, state) {
                    if (err) {
                        console.error("Failed to get light state");
                        reject(err);
                    } else {

                        var data = {
                            state: { 
                                // belkin light
                                isOn: state != 0,
                                reachable: true
                            }
                        };                                   
                        accept(data);
                    }                
                })
            });
        }
    };
};

module.exports = Light;