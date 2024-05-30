const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")

const jwt = require('jsonwebtoken')
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/", {
    title: "Account",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver account update view
* *************************************** */
async function buildAccountUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = await accountModel.getAccountById(req.params.account_id)
  res.render("account/update", {
    title: "Edit Account Details",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "success",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Update account information
* *************************************** */
async function updateAccountDetails(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  let result = await accountModel.updateAccountDetails(
      account_id,
      account_firstname,
      account_lastname,
      account_email
  )

  if (result) {

    res.locals.accountData = {account_id, account_firstname, account_lastname, account_email }

    req.flash(
      "success",
      `Congratulations, you\'re updated ${account_firstname}.`
    )
    res.status(201).render("account/update", {
      title: "Login",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Edit account details",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

}

async function updateAccountPassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body
  const { account_firstname, account_lastname, account_email } = await accountModel.getAccountById(account_id)
  let hashedPassword

  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error updating the password.')
    res.status(500).render("account/update", {
      title: "Edit account details",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  const result = await accountModel.updateAccountPassword(account_id, hashedPassword)

  if (result) {
    req.flash(
      "success",
      `Congratulations, password has been updated.`
    )
    res.status(201).render("account/update", {
      title: "Login",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Edit account details",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    } else {
      throw new Error("Password Incorrect.")
    }
  } catch (error) {
    req.flash("warning", error.message)
    res.redirect("back")
  }
}

async function accountLogout(req, res) {
  res.clearCookie("jwt");
  res.locals.loggedin = 0;
  res.redirect('/');
}

/* ****************************************
*  Deliver Delete Confirmation view
* *************************************** */
async function buildDeletion(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/confirmDeletion", {
    title: "Confirm Account Deletion",
    nav,
    errors: null,
    account_id: req.params.account_id
  })
}

async function accountDelete(req, res) {
  const { account_id, account_password } = req.body
  const accountData = await accountModel.getAccountById(account_id)

  try {
    let match = await bcrypt.compare(account_password, accountData.account_password)
    if (match) {
      delete accountData.account_password
      try {
        const confirmation = await accountModel.deleteAccount(account_id)
        if(!confirmation) {
          req.flash("success", "Account deleted.")
          res.clearCookie("jwt");
          res.locals.loggedin = 0;
          res.redirect('/')
        }
      } catch (error) {
        return new Error("Unable to delete account.")
      }
    } else {
      throw new Error('Password Incorrect')
    }
  } catch (error) {
    req.flash("warning", error.message)
    res.redirect("back")
  }

}


module.exports = { 
  buildLogin,
  buildRegister,
  buildAccount,
  buildAccountUpdate,
  buildDeletion,
  registerAccount,
  updateAccountDetails,
  updateAccountPassword,
  accountLogin,
  accountLogout,
  accountDelete,
}