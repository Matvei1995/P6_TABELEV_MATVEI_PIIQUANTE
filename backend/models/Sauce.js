const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },// l'ident MongoDB unique de l'utilisateur qui a créé la sauce
    name: { type: String, required: true },//nom de la sauce
    manufacturer: { type: String, required: true },//fabricant de la sauce
    description: { type: String, required: true },//description de la sauce
    mainPepper: { type: String, required: true },// le principal ingrédient épicé de la sauce
    imageUrl: { type: String, required: true },// l'URL de l'image de la sauce téléchargée par l'utilisateur 
    heat: { type: Number, required: true },//nmbr entre 1 et 10 décrivant la sauce
    likes: { type: Number, required: true, default:0 },//nmbr d'utilisateur qui aiment la sauce
    dislikes: { type: Number, required: true, default:0},//nmbr d'utilisateur qui n'aiment pas la sauce
    usersLiked: { type: [], required: true },// compteur de like      
    usersDisliked: { type: [], required: true }// compteur de dislike
});


//exports du module
module.exports = mongoose.model('Sauce', sauceSchema);