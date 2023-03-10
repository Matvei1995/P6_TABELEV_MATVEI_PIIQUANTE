const passwordValidatorSchema = require('../models/password');

// vérifie que le mot de passe valide le schema décrit
module.exports = (req, res, next) => {
    if (!passwordValidatorSchema.validate(req.body.password)) {
        res.writeHead(400, '{"message":"Mot de passe requis : 3 caractères minimun. Au moins 1 Majuscule, 1 minuscule. Sans espaces, 2chiffres"}', {
            'content-type': 'application/json'
        });
        res.end('Format de mot de passe incorrect');
    } else {
        next();
    }
};