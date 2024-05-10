const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
            + '<a href="/inv/type/'
            + row.classification_id
            + '" title="See our inventory of '
            + row.classification_name
            + ' vehicles">'
            + row.classification_name
            + '</a>'
            + "</li>"
    });
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildVehicleDetails = async function(data) {
  let layout
  if(!data) return '<p class="notice">Looks like there is nothing here. </p>';

    layout = `
      <section class="grid">
          <img src="${data.inv_image }" alt="Image of ${ data.inv_make } ${ data.inv_model }" class="vehicle-img">
          <div>
              <h2>${ data.inv_make } ${ data.inv_model } Details</h2>
              <p class="price-display"><b>Price: </b>
                  ${ Intl.NumberFormat('en-US', {
                      style:'currency',
                      currency: 'USD',
                  }).format(data.inv_price) }</p>
              <p><b>Description: </b>${ data.inv_description }</p>
              <p><b>Color: </b> ${ data.inv_color }</p>
              <p><b>Miles: </b> 
                  ${ Intl.NumberFormat('en-US').format(data.inv_miles) }</p>    
          </div>
      </section>
    `

  return layout;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

Util.serverError = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(() => next({status: 500}))

module.exports = Util