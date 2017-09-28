const express = require('express');
const handlebars = require('express-handlebars');
const fs = require('fs');
const app = express();
const lipsum = fs.readFileSync('lipsum.txt').toString();

app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('index', {
        img: `<img class="bg" src="imgs/splash-${Math.ceil(Math.random() * 20)}.jpg">`,
        lipsum
    });
});

app.locals.init = () => {
    console.log('Futurebound frontend online.');
};

module.exports = app;