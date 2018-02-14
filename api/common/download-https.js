var https = require('https');

module.exports = function(url) {
    
    return new Promise(function(accept, reject) {

        var result = "";

        var req = https.get(url, function(response) {

            if (response.statusCode != 200) {
                reject(response);
                return;
            }

            response.on('data', function(buff) {
                result += buff;
            });

            response.on('end', function() {
                accept(result);
            });
        });

        req.on('error', reject);
    });
}