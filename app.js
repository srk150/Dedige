const express = require("express");
const session = require("express-session");
const dbConn = require("./config/db");
const mysql = require("mysql");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const moment = require("moment");

const app = express();
const port = process.env.PORT || 8080;

const userMiddleware = require('./middleware/session_value');
// Use cookie-parser middleware
app.use(cookieParser());

// Use express-session middleware
app.use(
  session({
    secret: "your-secret-key", // Replace with a secure secret
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  })
);

app.set("view engine", "ejs");
app.use(express.static("public"));
// Set the base URL variable
app.locals.baseUrl = process.env.baseUrl;
// Configure middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use your custom middleware to fetch user info
app.use(userMiddleware);

// Set up routes for controller
const indexRoute = require("./routes/index");
const loginRoute = require("./routes/login");
const adminController = require("./controllers/adminController");
const portfolioController = require("./controllers/portfolioController");
const partnerController = require("./controllers/partnerController");

app.use("/admin", indexRoute);
// app.use("/admin", indexRoute);
app.use("/login", loginRoute);

// admin controller routes
app.get("/forgot", adminController.forgotpass);
app.get("/change", adminController.changepass);
app.post("/admin/forgotPassword", adminController.forgotPassword);
app.post("/admin/updPassword", adminController.updPassword);
app.get("/admin/contact", adminController.contact);
app.post("/contact_user", adminController.contact_user);
app.get("/settings", adminController.AdminSettings);

//portfolioController routes
app.get("/portfolio", portfolioController.portfolio);
app.get("/addPortfolio", portfolioController.addPortfolio);
app.post("/insertPortfolio", portfolioController.insertPortfolio);
app.delete("/delportfolio/:id", portfolioController.delportfolio);
app.get("/editPortfolio/:id", portfolioController.editPortfolio);
app.post("/updatePortfolio", portfolioController.updatePortfolio);


//partnerController routes
app.get("/partners", partnerController.partners);
app.get("/addPartner", partnerController.addPartner);
app.post("/insertPartner", partnerController.insertPartner);
app.delete("/delpartner/:id", partnerController.delpartner);
app.get("/editPartner/:id", partnerController.editPartner);
app.post("/updatePartner", partnerController.updatePartner);


//Use the route for /webcommon/api
//http://localhost:3000/webcommon/api/portfolioList for portfolio api
//http://localhost:3000/webcommon/api/partnerList for partner api
//http://localhost:3000/webcommon/api/contactApiForAmin for Contact api
//parameter
// {
//   "email": "sharukhkhan@belgiumwebnet.com",
//   "mobile": "9617282849",
//   "request": "demo test."
// }

// [
//   {
//       "id": 32,
//       "type": "4444444444444",
//       "title": "66666666666666",
//       "descp": "555555555555555",
//       "pimg": "pimg-1712145989855-486724559.png",
//       "logo_image": [
//           {
//               "logo": "logo-1712146009408-917225275.png",
//               "url": "000000000"
//           },
//           {
//               "logo": "logo2-1712146009413-386228914.png",
//               "url": "1111111111"
//           },
//           {
//               "logo": "logo3-1712146009415-627984900.png",
//               "url": "22222222222"
//           },
//           {
//               "logo": "logo4-1712146009416-588629047.png",
//               "url": "333333333"
//           }
//       ]
//   }
// ]


const webApiRoutes = require("./routes/webApi");
app.use("/webcommon/api", webApiRoutes);

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.baseUrl}`);

});