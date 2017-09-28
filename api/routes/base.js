const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({endpoints: {
        base: [
            '/whoami',
            '/reset-toen'
        ],
        auth: [
            '/auth/users',
            '/auth/users/:name',
            '/auth/delete',
            '/auth/generate'
        ],
        yt: [
            '/yt/search'
        ]
    }});
});

router.get('/whoami', (req, res) => {
    res.json(res.locals.user);
});

router.get('/reset-token', (req, res) => {
    let newInfo = req.app.locals.genToken(res.locals.user.name, res.locals.user.admin);
    let date = new Date();

    res.cookie('token', newInfo.token, {expires: new Date(date.setMonth(date.getMonth() + 3))});
    res.json({token: newInfo.token});
});

module.exports = router;