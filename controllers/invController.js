const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}



/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId;
  const data = await invModel.getVehicleDetails(vehicle_id);
  const content = await utilities.buildVehicleDetails(data[0]);
  let nav = await utilities.getNav();
  let vehicleName;
  vehicleName = data[0].inv_make + " " + data[0].inv_model
  res.render('./inventory/vehicle', {
    title: vehicleName,
    nav,
    content
  })
}

invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Management",
    nav
  })
}

invCont.buildClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

invCont.addClassification = async function (req, res, next) {
  const {classification_name} = req.body
  const insertResult = await invModel.createClassification(classification_name)
  let nav = await utilities.getNav();

  if (!insertResult) {
    req.flash(
      "notice",
      `Successfully added ${classification_name} to the list of classifications!`
    )
    res.status(201).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  } else {
    req.flash(
      "warning",
      `Sorry, ${classification_name} was not added to the list of classifications.`
    )
    res.status(501).render("inventory/add-classification", {
      title: "Add Classifiation",
      nav,
      errors: null
    })
  }
}

invCont.addInventoryHandler = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Inventory Item",
    nav,
    errors: null,
    classificationList
  })
}

invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  let { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  } = req.body;
  
  const createdItem = await invModel.createInventoryItem(
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  );

  if (createdItem) {
    req.flash(
      "notice",
      `Successfully added the ${inv_make + " " + inv_model} to the inventory!`
    )
    res.status(201).redirect('/inv').render("inventory/management", {
      title: "Management",
      nav,
      errors: null,
    })
  } else {
    req.flash(
      "warning",
      `Sorry, due to an error, the ${inv_make + " " + inv_model} was not added to the inventory.`
    )
    res.status(501).render("inventory/add-inventory", {
      title: "Add Classifiation",
      nav,
      errors: null,
      classificationList
    })
  }
}

module.exports = invCont;