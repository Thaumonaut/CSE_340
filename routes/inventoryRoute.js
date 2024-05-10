const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

router.get("/type/:classificationId", utilities.serverError(invController.buildByClassificationId));
router.get("/detail/:vehicleId", utilities.serverError(invController.buildByVehicleId));

module.exports = router;