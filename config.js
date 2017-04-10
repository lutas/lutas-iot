
module.exports = {

    serverPort: process.env["ServerPort"] || 4000,

    metro: {
        location: process.env["MetroLocation"],
        apiKey: process.env["GoogleAPIKey"]
    },

    datesTo: [
        process.env["Date1"],
        process.env["Date2"],
        process.env["Date3"]
    ],

    datesFrom: [
        process.env["Date1From"],
        process.env["Date2From"],
        process.env["Date3From"]
    ],

    running: {
        login: process.env["RunLogin"],
        password: process.env["RunPassword"]
    },

    belkin: {
        livingRoom: process.env["BelkinLivingRoom"]
    },

    calendar: {
        icalUrl: process.env["CalendarUrl"]
    }

};
