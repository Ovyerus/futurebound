module.exports = (req, res, next) => {
    let data = '';

    req.on('data', chunk => data += chunk);
    req.on('end', () => {
        req.body = data;

        if (req.is('application/json')) {
            try {
                req.json = JSON.parse(data);
                req.hasJSON = true;
            } catch(e) {
                res.status(400).json({error: 'Invalid JSON body.', code: 400});
                return;
            }
        } else {
            req.json = {};
            req.hasJSON = false;
        }

        next();
    });
};