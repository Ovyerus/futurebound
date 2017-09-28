const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    if (!res.locals.user.admin) res.status(403).json({error: 'Forbidden', code: 403});
    else next();
});

router.get('/', (req, res) => {
    res.json({endpoints: [
        '/auth/users',
        '/auth/users/:name',
        '/auth/delete',
        '/auth/generate'
    ]});
});

router.get('/users', (req, res) => {
    res.json(req.app.locals.users);
});

router.get('/users/:name', (req, res) => {
    if (!req.app.locals.users[req.params.name]) return res.status(404).json({error: 'User does not exist.', code: 404});
    
    let user = req.app.locals.users[req.params.name];

    res.json({name: req.params.name, token: user.token, admin: user.admin});
});

router.post('/generate', (req, res) => {
    if (!req.hasJSON) return res.status(400).json({error: 'JSON body required.', code: 400});
    if (!Object.keys(req.json)[0]) return res.status(400).json({error: 'JSON body is empty.', code: 400});
    if (!req.json.name) return res.status(400).json({error: 'Missing required field "name".', code: 400});

    let {name, admin = false} = req.json;
    let details = req.app.locals.genToken(name, admin);

    res.json(details);
});

router.post('/delete', (req, res) => {
    if (!req.hasJSON) return res.status(400).json({error: 'JSON body required.', code: 400});
    if (!Object.keys(req.json)[0]) return res.status(400).json({error: 'JSON body is empty.', code: 400});
    if (!req.json.name) return res.status(400).json({error: 'Missing required field "name".', code: 400});
    if (!req.app.locals.users[req.json.name]) return res.status(404).json({error: 'User does not exist.', code: 404});
    if (req.app.locals.users[req.json.name].token === res.locals.user.token) return res.status(403).json({error: 'You cannot delete yourself', code: 403});

    try {
        req.app.locals.deleteUser(req.json.name);
        res.json({message: `Successfully deleted user "${req.json.name}"`});
    } catch(err) {
        res.status(500).json({error: err, code: 500});
    }
});

module.exports = router;