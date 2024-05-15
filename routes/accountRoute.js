const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController')
const utilities = require('../utilities/')
const regValidate = require("../utilities/account-validation")

// ROUTER GET
router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// ROUTER POST
router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

module.exports = router;