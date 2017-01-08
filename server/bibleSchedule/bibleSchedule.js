const scheduleData = require('./scheduleCalc');
scheduleData.res.scheduleDctf('*', dd=> {
    console.log('done');
});

module.exports= {
    res: scheduleData.res
};