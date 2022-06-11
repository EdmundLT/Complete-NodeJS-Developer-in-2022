const request = require('./internals/req');

request.send = function() {
    console.log('custom send fucntion');
}

request.send();