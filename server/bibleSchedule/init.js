
const calcLib = require('./scheduleCalcLib');
const curSchedule = calcLib.schedule.getScheduleByOffset(new Date(), 0);
//console.log(curSchedule);
const reduce = require('lodash/reduce');

function convertWeek(which) {
    switch (which)
    {
        case 0: return '一';
        case 1: return '二';
        case 2: return '三';
        case 3: return '四';
        case 4: return '五';
        case 5: return '六';
        case 6: return '日';
    }
}
function setupRoutes(app) {
    app.get('/blankView', (req, res) => {
        let str = ''
        curSchedule.curWeekView.map((r, i)=>{ str = `${str}${r.date.substr(5)}(${convertWeek(i)}) ${r.verse}<br>` });
        res.send(200, str);
    });
    app.get('/schedule',(req,res)=> {
        res.jsonp(curSchedule);
    })
}

module.exports = {
    setup: setupRoutes
}