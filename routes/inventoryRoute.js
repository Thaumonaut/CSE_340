const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validation = require("../utilities/inv-validation")

router.get("/type/:classificationId", utilities.serverError(invController.buildByClassificationId));
router.get("/detail/:vehicleId", utilities.serverError(invController.buildByVehicleId));

router.get("/management", utilities.handleErrors(invController.buildManagementView))

router.get("/classification", utilities.handleErrors(invController.buildClassification))
router.get("/inventory-item", utilities.handleErrors(invController.buildClassification))

router.post(
  "/classification",
  validation.classificationRules(),
  validation.checkClassification,
  utilities.handleErrors(invController.addClassification)
)

module.exports = router;