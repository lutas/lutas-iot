var config = require('../../config');
var download = require('../common/download-https');

const PooliumURI = 'https://www.poolium.win/index.php?page=api';

let apikey = config.crypto.pooliumAPI;

function update() {

    return new Promise((accept, reject) => {
        Promise.all([
            download(PooliumURI + '&action=getuserbalance&id=866&api_key=' + apikey),
            download(PooliumURI + '&action=getdashboarddata&id=866&api_key=' + apikey),
            download(PooliumURI + '&action=getuserworkers&id=866&api_key=' + apikey),
            download('https://api.coinmarketcap.com/v1/ticker/veriumreserve/?convert=GBP'),            
            download('https://api.coinmarketcap.com/v1/ticker/vericoin/?convert=GBP')
        ]).then(data => {

            accept({
                balance: JSON.parse(data[0]).getuserbalance.data,
                dashboard: JSON.parse(data[1]).getdashboarddata.data,
                workers: JSON.parse(data[2]).getuserworkers.data,
                vrm: JSON.parse(data[3])[0],
                vrc: JSON.parse(data[4])[0]
            });

        }, reject);
    });  
}

module.exports = { 
    
    get: function() {
        return update();
    }
}