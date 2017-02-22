
module.exports = {

    serverPort: process.env["ServerPort"] || 4000,

    metro: {
        location: process.env["MetroLocation"],
        apiKey: process.env["GoogleAPIKey"]
    },

    dates: [
        process.env["Date1"],
        process.env["Date2"],
        process.env["Date3"]
    ]

};
