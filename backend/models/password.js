const passwordValidator = require('password-validator');

// Schéma de mot de passe plus sécure
const passwordValidatorSchema = new passwordValidator();

// Contraintes du mot de passe
passwordValidatorSchema
.is().min(6)                                    // Minimum de 3
.is().max(100)                                  // Maximum de 100
.has().uppercase()                              // Doit contenir miniscule
.has().lowercase()                              // Doit contenir Majuscule
.has().digits(2)                                // Doit avoir au moins 2 chiffres
.has().not().spaces()                           // Ne pas avoir d'espace
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = passwordValidatorSchema;