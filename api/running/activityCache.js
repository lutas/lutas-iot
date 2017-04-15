var fs = require('fs');
var activities = {};
var mkdirp = require('mkdirp');

var cacheDirectory = "./data/cache/runactivities";
if (!fs.existsSync(cacheDirectory)) {
    mkdirp.sync(cacheDirectory);
}

module.exports = {

    getCacheFilename: function(id) {
        return cacheDirectory + "/" + id + ".json";
    },

    getActivity: function(id) {

        var filename = this.getCacheFilename(id);

        if (!fs.existsSync(filename)) {
            return null;
        }

        var activityData = fs.readFileSync(filename);
        return JSON.parse(activityData);
    },

    cache: function(id, data) {

        var filename = this.getCacheFilename(id);
        console.log("Caching " + filename);

        var stringData = JSON.stringify(data);
        fs.writeFile(filename, stringData);
    }
};