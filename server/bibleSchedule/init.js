const schedule = require('./bibleSchedule');

function setupRoutes(app) {
    app.get('/schedule', (req, res) => {
        res.jsonp({
            curweek: schedule.res.CurWeekAry,
            scheduleStarts: schedule.res.scheduleStarts,
            curSchedule: schedule.res.curSchedule
        });
    });
}

module.exports = {
    setup: setupRoutes
}