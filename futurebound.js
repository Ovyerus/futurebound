const express = require('express');
const fs = require('fs');
const api = require('./api');
const frontend = require('./frontend');
const app = express();

app.disable('x-powered-by');

app.use('/api', api);
app.use('/', frontend);
app.use(express.static(__dirname + '/static'));

if (!fs.existsSync('./uses.json')) fs.writeFileSync('./users.json', '{}');

app.listen(8080, () => {
    console.log('Futurebound running on port 8080.');
    api.locals.init();
    frontend.locals.init();
});