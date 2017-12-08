const http = require('http');
const router = require('./router');
var port = 3000;

http.createServer(router).listen(port);
console.log('Server startet. Port: ' + port); 