const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};
const invModel = require("../models/inventory-model");

validate.classificationRules = () => {
  return [
    body('classification_name')
    .trim()
    .notEmpty()
    .isAlpha()
    .withMessage("A Valid name is require.")
  ]
}

validate.checkClassification = async (req, res, next) => {
  const { classification_name } = req.body;

  let errors = [];
  errors = validationResult(req);
  if(!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name
    })
    return;
  }

  next();
}

module.exports = validate;