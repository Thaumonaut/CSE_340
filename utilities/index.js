const invModel = require("../models/inventory-model");
const Util = {};

const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list +=
      "<li>" +
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>" +
      "</li>";
  });
  list += "</ul>";
  return list;
};

/* ************************
 * Constructs the classification selection input
 ************************** */
Util.buildClassificationList = async function (id) {
  let data = await invModel.getClassifications();
  let selectList =
    '<select name="classification_id" id="classificationList" required>';
  selectList += '<option value="">Choose a Classification</option>';
  data.rows.forEach((row) => {
    selectList += `<option value="${row.classification_id}"`
    if (row.classification_id == id) selectList+= "selected"
    selectList += `>${row.classification_name}</option>`;
  });
  selectList += "</select>";

  return selectList;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildVehicleDetails = async function (data) {
  let layout;
  if (!data) return '<p class="notice">Looks like there is nothing here. </p>';

  layout = `
      <section class="grid">
          <img src="${data.inv_image}" alt="Image of ${data.inv_make} ${
    data.inv_model
  }" class="vehicle-img">
          <div>
              <h2>${data.inv_make} ${data.inv_model} Details</h2>
              <p class="price-display"><b>Price: </b>
                  ${Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(data.inv_price)}</p>
              <p><b>Description: </b>${data.inv_description}</p>
              <p><b>Color: </b> ${data.inv_color}</p>
              <p><b>Miles: </b> 
                  ${Intl.NumberFormat("en-US").format(data.inv_miles)}</p>    
          </div>
      </section>
    `;

  return layout;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
Util.serverError = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(() => {
    res.status(500);
    next({ status: res.statusCode });
  });

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

Util.checkEmployeeLogin = (req, res, next) => {
  // Check if logged in first, and exit early if not.
  if (!res.locals.loggedin) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  const account_type = res.locals.accountData.account_type;

  // Could also use |account_type != "Client"| since there are only three options
  // I like to be more specific here to have more control
  if ( account_type == "Employee" || account_type == "Admin") {
    next()
  } else {
    req.flash("notice", "Access Denied. Sign in as an Employee or Admin for access.")
    return res.redirect("/account")

  }

}

module.exports = Util;
