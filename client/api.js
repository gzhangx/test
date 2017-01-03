const axios = require('axios');

function getReadList() {
    return axios.get('http://localhost:3000/data.json').then(res=> {
       return res;
    });
}

export  default {
  getReadList,
};