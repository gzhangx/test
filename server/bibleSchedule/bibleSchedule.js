const scheduleData = require('./scheduleCalc');
scheduleData.res.scheduleDctf('*', dd=> {
    console.log('done');
    console.log(scheduleData.res.CurWeekAry);
});

module.exports= {
    res: scheduleData.res
};