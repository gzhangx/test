const axios = require('axios');

const reqBase = 'http://localhost:3000';
function getReadList() {
    return axios.get('/schedule').then(res=> {
       return res;
    });
}

export  default {
  getReadList,
};