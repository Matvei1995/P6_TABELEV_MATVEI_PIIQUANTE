const emailValidator = require("email-validator");

emailValidator.validate("test@email.com");

module.exports = emailValidator;