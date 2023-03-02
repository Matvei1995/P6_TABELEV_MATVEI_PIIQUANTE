const emailValidator = require('../models/email');

// vérifie que le mot de passe valide le schema décrit
module.exports = (req, res, next) => {
    if (!emailValidator.validate(req.body.email)) {
        res.status(201)
        res.writeHead(400, '{"message":"l email doit avoir  : 3 caractères minimun.Une @, , Sans espaces"}', {
            'content-type': 'application/json'
        });
        res.end('Format email erroné');
    } else {
        next();
    }
};