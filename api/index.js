// Imports
const express = require('express');
const fs = require('fs');
const app = express();

// Misc stuff
require(`${__dirname}/ext`)(app);
app.disable('x-powered-by');

// Middleware
app.use(require('cookie-parser')());
app.use(require(`${__dirname}/authorise`));
app.use(require(`${__dirname}/parseBody`));

// Routes
app.use('/auth', require(`${__dirname}/routes/auth`));
app.use('/', require(`${__dirname}/routes/base`));

app.locals.init = () => {
    // This returns empty object and I don't fucking know why.
    let a = JSON.parse(fs.readFileSync('./users.json'));
    app.locals.users = a;
    console.log(a);

    app.locals.genPass();
    console.log('Futurebound API running.');
    
    if (!Object.values(app.locals.users).filter(v => v.admin)[0]) {
        app.locals.genToken('admin', true);
        console.log('Generated default admin token due to lack of admins.');
    }
};

module.exports = app;