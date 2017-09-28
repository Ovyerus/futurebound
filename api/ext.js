const crypto = require('crypto');
const fs = require('fs');

module.exports = app => {
    app.locals.genPass = () => {
        let a = Date.now().toString(Math.ceil(Math.random() * 30) + 1).split('').reverse().join('');
        app.locals.pass = a;
        return a;
    };

    app.locals.genToken = (name, admin=false) => {
        let t = Math.floor(~(~Math.floor(Date.now() + Math.random() * (Math.random() * 420 + 69)) >> Math.random() * 50));
        t = parseInt(t, 8).toString();
        let n = name.replace(/\s+/g, name).split('').reverse().join('');
        let r = t.slice(t.length / 2) + n.slice(0, n.length / 2) + t.slice(0, t.length / 2) + n.slice(n.length / 2);
        let c = crypto.createCipher('aes256', app.locals.genPass());
        let a = c.update(r);
        a += c.final('hex');
        a = a.slice(0, 32);

        fs.writeFileSync(`./users.json`, JSON.stringify(Object.assign(app.locals.users, {[name]: {token: a, admin}}), null, '    '));
        return {name, admin, token: a};
    };

    app.locals.deleteUser = name => {
        if (!app.locals.users[name]) throw new Error(`User "${name}" doesn't exist.`);

        delete app.locals.users[name];
        fs.writeFileSync(`./users.json`, JSON.stringify(app.locals.users, null, '    '));
    };
};