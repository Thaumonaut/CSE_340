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
    .withMessage("Vehicle make is required."),

    body('inv_model')
    .trim()
    .notEmpty()
    .withMessage("Vehicle model is required."),

    body('inv_year')
    .trim()
    .notEmpty()
    .withMessage("Vehicle year is required."),

    body('inv_description')
    .trim()
    .notEmpty()
    .withMessage("Vehicle description is required."),

    body('inv_image')
    .trim()
    .notEmpty()
    .withMessage("Vehicle image is required."),

    body('inv_thumbnail')
    .trim()
    .notEmpty()
    .withMessage("Vehicle thumbnail is required."),

    body('inv_price')
    .trim()
    .notEmpty()
    .withMessage("Vehicle price is required."),

    body('inv_miles')
    .trim()
    .notEmpty()
    .withMessage("Vehicle miles is required."),

    body('inv_color')
    .trim()
    .notEmpty()
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
    inv_color
  } = req.body;

  
  let errors = [];
  errors = validationResult(req);
  if(!errors.isEmpty()) {
    let nav = utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
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