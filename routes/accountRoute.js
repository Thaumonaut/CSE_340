const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController')
const utilities = require('../utilities/')
const regValidate = require("../utilities/account-validation")

// ROUTER GET
router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))
router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));

// ROUTER POST
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;
