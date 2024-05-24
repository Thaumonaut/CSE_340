const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validation = require("../utilities/inv-validation")

/** ===========================================
 * Show management view
 * =========================================== */
router.get("/", utilities.checkEmployeeLogin, utilities.handleErrors(invController.buildManagementView))

/** ===========================================
 * Show vechiles by classification and details view
 * =========================================== */
router.get("/type/:classificationId", utilities.serverError(invController.buildByClassificationId));
router.get("/detail/:vehicleId", utilities.serverError(invController.buildByVehicleId));

/** ===========================================
 * Show classification adding and inventory adding views
 * =========================================== */
router.get("/classification", utilities.checkEmployeeLogin, utilities.handleErrors(invController.buildClassification))
router.get("/create", utilities.checkEmployeeLogin, utilities.handleErrors(invController.buildInventoryCreateView))

/** ===========================================
 * Get vehicle information from DB in JSON format
 * =========================================== */
router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON))

/** ===========================================
 * Edit vehicle details from management view
 * =========================================== */
router.get("/edit/:vehicleId", utilities.checkEmployeeLogin, utilities.handleErrors(invController.buildInventoryEdit))

/* ===========================================
 * Create inventory item deletion view
 * =========================================== */
router.get("/delete/:vehicleId", utilities.checkEmployeeLogin, utilities.handleErrors(invController.buildDeleteInventory))

/* ===========================================
 * Delete item from inventory
 * =========================================== */
router.post("/delete/", utilities.handleErrors(invController.deleteInventory))


/** ===========================================
 * Add new classification of vehicle
 * =========================================== */
router.post(
  "/classification",
  validation.classificationRules(),
  validation.checkClassification,
  utilities.handleErrors(invController.addClassification)
)

/* ===========================================
 * Add new vehicle to the inventory
 * =========================================== */
router.post(
  "/create",
  validation.inventoryRules(),
  validation.checkInventory,
  utilities.handleErrors(invController.addInventory)
)

/* ===========================================
 * Update details in inventory
 * =========================================== */
router.post("/update", 
  validation.inventoryRules(),
  validation.checkUpdateData,
  invController.updateInventory
)

module.exports = router;