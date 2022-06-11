const request = require('./internals/req');
const response = require('./internals/res');

// const {send, read} = require('./internals');
function makeRequest(url, data){
    request.send(url, data);
    return response.read();
}

const responseData = makeRequest('https://www.google.com', 'hello');
console.log(responseData);

// console.log(require.cache);