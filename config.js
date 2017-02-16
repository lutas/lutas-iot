
module.exports = {

    serverPort: process.env["ServerPort"] || 4000,

    metro: {
        location: process.env["MetroLocation"],
        apiKey: process.env["GoogleAPIKey"]
    }

};
