module.exports = (req, res, next) => {
    if (!req.get('authorization') && !req.cookies.token) return res.status(401).json({error: 'Authentication required.', code: 401});

    let token = req.get('authorization') || req.cookies.token;
    let user = Object.keys(req.app.locals.users).filter(u => req.app.locals.users[u].token === token)[0];

    if (token.length !== 32 || !user) return res.status(401).json({error: 'Bad token.', code: 401});

    res.locals.user = Object.assign({name: user}, req.app.locals.users[user]);

    if (!req.cookies.token || req.cookies.token !== token) {
        let date = new Date();
        res.cookie('token', token, {expires: new Date(date.setMonth(date.getMonth() + 3))});
    }

    next();
};