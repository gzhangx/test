const express = require('express');
const app = express();

app.use(express.static('dist'));

const bibleSchedule = require('./bibleSchedule/init');
bibleSchedule.setup(app);

app.listen(3000, ()=>console.log('started'));
