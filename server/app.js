const express = require('express');
const app = express();

app.use(express.static('dist'));

const bibleSchedule = require('./bibleSchedule/init');
bibleSchedule.setup(app);

const test = require('./bibleSchedule/scheduleCalcLib');
const res = test.schedule.getScheduleByOffset(new Date(), 0);
console.log(res);

app.listen(3000, ()=>console.log('started'));
