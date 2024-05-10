/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require('express-ejs-layouts')
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require('./routes/inventoryRoute')
const utilities = require('./utilities/')
const { populate } = require("dotenv")

/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use("/inv", inventoryRoute)

// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use(async (req, res, next) => {
  next({status: 404, message: 'Woops, that is not suppose to happen.'})
})
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = "Oh no! Something went wrong. Try a diferent route?"}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
