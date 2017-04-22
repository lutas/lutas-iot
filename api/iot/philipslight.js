var Hue = require('philips-hue');
var config = require('../../config');

var hue = new Hue();
hue.bridge = config.philips.bridgeIP;
hue.username = config.philips.username;

var config = require('../../config');

var PhilipsLight = function(id, philipsId, name) {

    isOn = false;
     
    // doesn't require a connection
    loadedPromise = Promise.resolve();

    return {
        name: name,
        loaded: loadedPromise,
        id: id,
        philipsId: philipsId,

        changeState: function(on) {

            if (on) {
                return hue.light(this.philipsId).on()
            } else {
                return hue.light(this.philipsId).off();
            }
        },

        on: function() {
            return this.changeState(1);
        },

        off: function() {
            return this.changeState(0);
        },

        isOn: function() {
            var info = hue.light(philipsId).getInfo();

            return info;
        }
    };
};


module.exports = PhilipsLight;