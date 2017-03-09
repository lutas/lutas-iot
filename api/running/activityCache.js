var fs = require('fs');
var activities = {};

var cacheDirectory = "./cache/runactivies";
if (!fs.existsSync(cacheDirectory)) {
    fs.mkdirSync(cacheDirectory);
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