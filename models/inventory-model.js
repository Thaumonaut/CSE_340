const pool = require("../database")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getVehicleDetails(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.inv_id = $1`,
      [inv_id]
    )
    return data.rows;
  } catch (error) {
    console.error('Error gathering vehicle data: ' + error)
  }
}

async function createClassification(classification_name) {
  try {
    await pool.query(
    ` INSERT INTO classification
        (classification_name)
      VALUES
        ($1)
      RETURNING *`,
      [classification_name]
    )
    return;
  } catch (error) {
    return error.message
  }
}

async function createInventoryItem(
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
) {
  const imgURI = "/images/vehicles/"

  const sql = 
    `INSERT INTO inventory
      (inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *`

  try {
    const data = await pool.query(
      sql,
      [inv_make,
        inv_model,
        inv_year,
        inv_description,
        imgURI + inv_image,
        imgURI + inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id]
    )
    return data.rows;
  } catch (error) {
    console.error("Error inserting inventory item " + error)
  }
}

async function updateInventory(
  inv_id,
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
) {
  const imgURI = "/images/vehicles/"

  const sql = 
    `UPDATE inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10
    WHERE inv_id = $11 RETURNING *`

  try {
    const data = await pool.query(
      sql,[ 
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        imgURI + inv_image,
        imgURI + inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id,
        inv_id
      ]
    )
    return data.rows[0];
  } catch (error) {
    console.error("Error updating inventory item: " + error)
  }
}

async function deleteInventory(inv_id) {
  const sql = "DELETE FROM inventory WHERE inv_id = $1"

  try {
    const data = await pool.query(
      sql,[inv_id]
    )
    return data;
  } catch (error) {
    new Error("Error deleting inventory item: " + error)
  }
}

module.exports = {
  getClassifications, 
  getInventoryByClassificationId,
  getVehicleDetails,
  createClassification,
  createInventoryItem,
  updateInventory,
  deleteInventory
}