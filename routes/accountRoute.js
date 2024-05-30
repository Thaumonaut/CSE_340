const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController')
const utilities = require('../utilities/')
const regValidate = require("../utilities/account-validation")

// ROUTER GET
router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))
router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));
router.get('/logout', utilities.handleErrors(accountController.accountLogout))

router.get('/update/:account_id', utilities.checkLogin, utilities.handleErrors(accountController.buildAccountUpdate))
router.get('/delete/:account_id', utilities.checkLogin, utilities.handleErrors(accountController.buildDeletion))


// ROUTER POST

// Create new user account
router.post(
  '/register',
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Update account information
router.post(
  '/updateDetails',
  regValidate.updateDetailsRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccountDetails)
)

// Update account information
router.post(
  '/updatePassword',
  regValidate.updatePasswordRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccountPassword)
)

router.post(
  '/delete',
  utilities.handleErrors(accountController.accountDelete)
)

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;
