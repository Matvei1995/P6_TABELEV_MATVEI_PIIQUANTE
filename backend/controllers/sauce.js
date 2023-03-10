//Stockage de toute la logique métier de ./routes

const Sauce = require('../models/Sauce');
const fs = require('fs'); // c'est file systeme soit système de fichier

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersliked: [' '],
        usersDisliked: [' ']

    });

    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistré !' }) })
        .catch((error) => { res.status(400).json({ message: error }) });
};

//Modifier un objet existant
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? { //extraction de l'objet y a t'il un fichier (file)
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body }; // si l'objet n'est pas transmit ont va regarder dans le corps de la requête req

    delete sauceObject._userId; // supprimer le user id pour éviter que quelqu'un crée un objet à sans nom puis le modifie pour l'assigner a quelqu'un d'autre(c une sécurité)
    Sauce.findOne({ _id: req.params.id }) //chercher si bien le meme utlisateur
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-autorisé' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

//Suppresion d'un objet
exports.deleteSauce = (req, res, next) => {
    
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-autorisé' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id }) //suprimer dans la base de donnée
                        .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
};
//Récupérer un seul objet 
exports.getOneSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error })); //Objet non Trouvé 404
}

//Trouver un objet 
exports.getAllSauces = (req, res, next) => {

    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));

}



//Permet la gestion des like/dislikes
 
  exports.likeSauce = (req, res, next) => {

    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    Sauce.findOne({ _id: sauceId })
        .then(sauce => {
            if (like === 1) {
                if (sauce.usersLiked.includes(userId)) {
                    res.status(401).json({error: 'Sauce déja liké'});
                } else {
                    Sauce.updateOne({ _id: sauceId }, { $inc: { likes: like++ }, $push: { usersLiked: userId } })
                        .then(() => res.status(200).json({ message: ` J'aime` }))
                        .catch(error => res.status(400).json({ error }))
                }
            } 
            else if (req.body.like === -1) {
                if (sauce.usersDisliked.includes(userId)) {

                    res.status(401).json({error: 'Sauce déja disliké'});

                } 
                else {
                    Sauce.updateOne({ _id: sauceId}, { $inc: { dislikes: (like++) * -1 }, $push: { usersDisliked: userId } })

                        .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))

                        .catch(error => res.status(400).json({ error }));
                }
            } else {
                if (sauce.usersLiked.includes(userId)) {

                    Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })

                        .then(() => { res.status(200).json({ message: `Je n'aime pas` }) })

                        .catch(error => res.status(400).json({ error }));

                } 
                else if (sauce.usersDisliked.includes(req.body.userId)) {

                    Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })

                            .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })

                            .catch(error => res.status(400).json({ error }));
                }
            }
        })

        .catch(error => res.status(400).json({ error }));   

    }