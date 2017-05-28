var running = {
    metresToMiles: function(metres) {
        return Math.round((metres / 1000) / 1.6 * 100) / 100;
    },

    getActivity: function(activityId) {
        return new Promise((accept, reject) => {
            const url = './running/' + activityId;
            $.ajax({
                url: url,
                type: 'GET',
                success: accept,
                error: reject
            });  
        });
    },

    getActivities: function(activities) {
        var data = [];

        return activities.reduce((prev, activity) => {

            return prev.then(activityData => {
                if (activityData) {
                    data.push(activityData);
                }
                return this.getActivity(activity);
            }, (err) => {throw err});
        }, Promise.resolve(null))
        .then(() => Promise.resolve(data));
    }
};
