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
    .withMessage("A valid name is required.")
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

validate.inventoryRules = () => {
  return [
    body('inv_make')
    .trim()
    .notEmpty()
    .isLength({min: 3})
    .withMessage("Vehicle make is required with minimum 3 characters."),

    body('inv_model')
    .trim()
    .notEmpty()
    .isLength({min:3})
    .withMessage("Vehicle model is required with minimum 3 characters."),

    body('inv_year')
    .trim()
    .notEmpty()
    .isLength({min:4, max:4})
    .withMessage("Vehicle year is required (YYYY)."),

    body('inv_description')
    .trim()
    .notEmpty()
    .withMessage("Vehicle description is required."),

    body('inv_image')
    .trim()
    .notEmpty()
    .matches("^[^\s]+\.(jpg|jpeg|png|gif|bmp)$")
    .withMessage("Vehicle image is required."),

    body('inv_thumbnail')
    .trim()
    .notEmpty()
    .matches("^[^\s]+\.(jpg|jpeg|png|gif|bmp)$")
    .withMessage("Vehicle thumbnail is required."),

    body('inv_price')
    .trim()
    .notEmpty()
    .isDecimal({decimal_digits: 2})
    .withMessage("Vehicle price is required."),

    body('inv_miles')
    .trim()
    .notEmpty()
    .isInt()
    .withMessage("Vehicle miles is required as integer ONLY."),

    body('inv_color')
    .trim()
    .notEmpty()
    .isAlpha("en-US", {ignore: "-"})
    .withMessage("Vehicle color is required."),

    body('classification_id')
    .trim()
    .notEmpty()
    .withMessage("Vehicle classification is required")
  ]
}

validate.checkInventory = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body;

  
  let errors = [];
  errors = validationResult(req);
  if(!errors.isEmpty()) {
    let nav = utilities.getNav();
    let classificationList = await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      errors,
      nav,
      title: "Create Inventory Item",
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classificationList
    })
    return;
  }
  
  next();
}

module.exports = validate;