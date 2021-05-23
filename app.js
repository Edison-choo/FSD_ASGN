/*
 * 'require' is similar to import used in Java and Python. It brings in the libraries required to be used
 * in this JS file.
 * */
const express = require("express");
const session = require("express-session");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const FlashMessenger = require("flash-messenger");
const Handlebars = require("handlebars");
const queryString = require("querystring");
const passport = require("passport");
const cookieSession = require("cookie-session");
const MySQLStore = require("express-mysql-session");
const db = require("./config/db");
/*
 * Loads routes file main.js in routes directory. The main.js determines which function
 * will be called based on the HTTP request and URL.
 */
const mainRoute = require("./routes/main");
const bookRoute = require("./routes/book");
const menuRoute = require("./routes/menu");
const resRoute = require("./routes/restaurant");
const reviewsRoute = require("./routes/reviews");
const createReviewsRoute = require("./routes/createReviews");
const userRoute = require("./routes/User");
const staffResRoute = require("./routes/staffRestaurant");
const createPromotions = require("./routes/createPromotions");
const bookingInterfaceRoute = require("./routes/bookingInterface");

/*
 * Creates an Express server - Express is a web application framework for creating web applications
 * in Node JS.
 */
const app = express();

// Creates static folder for publicly accessible HTML, CSS and Javascript files
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cookieSession({
    keys: ["key1", "key2"],
  })
);

app.use(session({ secret: "secret", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

const authenticate = require("./config/passport");
authenticate.localStrategy(passport);

app.use("/", mainRoute);
app.use("/book", bookRoute);
app.use("/menu", menuRoute);
app.use("/restaurant", resRoute);
app.use("/reviews", reviewsRoute);
app.use("/createReviews", createReviewsRoute);
app.use("/user", userRoute);
app.use("/staffRestaurant", staffResRoute);
app.use("/createPromotions", createPromotions);
app.use("/bookingInterface", bookingInterfaceRoute);

// Handlebars Middleware
/*
 * 1. Handlebars is a front-end web templating engine that helps to create dynamic web pages using variables
 * from Node JS.
 *
 * 2. Node JS will look at Handlebars files under the views directory
 *
 * 3. 'defaultLayout' specifies the main.handlebars file under views/layouts as the main template
 *
 * */
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main", // Specify default template views/layout/main.handlebar
  })
);
app.set("view engine", "handlebars");

// Body parser middleware to parse HTTP body in order to read HTTP data
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Method override middleware to use other HTTP methods such as PUT and DELETE
app.use(methodOverride("_method"));

// Enables session to be stored using browser's Cookie ID
app.use(cookieParser());

// To store session information. By default it is stored as a cookie on browser
app.use(
  session({
    key: "foodecent_session",
    secret: "foodecent",
    store: new MySQLStore({
      host: db.host,
      port: 3306,
      user: db.username,
      password: db.password,
      database: db.database,
      clearExpired: true,
      // How frequently expired sessions will be cleared; milliseconds:
      checkExpirationInterval: 900000,
      // The maximum age of a valid session; milliseconds:
      expiration: 900000,
    }),
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

// Place to define global variables - not used in practical 1
app.use(function (req, res, next) {
  next();
});

// Use Routes
/*
 * Defines that any root URL with '/' that Node JS receives request from, for eg. http://localhost:5000/, will be handled by
 * mainRoute which was defined earlier to point to routes/main.js
 * */
app.use("/", mainRoute); // mainRoute is declared to point to routes/main.js
// This route maps the root URL to any path defined in main.js

/*
 * Creates a unknown port 5000 for express server since we don't want our app to clash with well known
 * ports such as 80 or 8080.
 * */
const port = 5000;

// Starts the server and listen to port 5000
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

// Bring in database connection
const DB = require("./config/DBConnection");
// Connects to MySQL database
DB.setUpDB(false);

Handlebars.registerHelper("ifEquals", function (a, b, options) {
  if (a == b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper("ifIn", function (elem, list, options) {
  if (list.indexOf(elem) > -1) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper("checklength", function (v1, v2, options) {
  "use strict";
  if (v1.length > v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

Handlebars.registerHelper("distanceFixed", function (distance) {
  if (Number.isInteger(distance)) {
    return distance.toFixed(2);
  }
});

Handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});
