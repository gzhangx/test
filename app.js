const express = require('express');
const app = express();

app.use(express.static('dist'));

app.get('/test', (req, res)=> {
  res.send('<h1>OK</h1>');
});

app.listen(3000, ()=>console.log('started'));
