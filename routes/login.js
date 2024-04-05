const express = require("express");
const router = express.Router();
var dbConn = require("../config/db");
const bcrypt = require("bcrypt");
var session = require("express-session");
const cookieParser = require("cookie-parser");

//logout
router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/admin");
});

//login using routes for ajax function
router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || email.trim() === "") {
    return res.status(401).json({ message: "Email is empty!" });

  } else if (!password || password.trim() === "") {

    return res.status(401).json({ message: "Password is empty!" });
  }

  dbConn.query(
    "SELECT * FROM auth WHERE email = ?",
    [email],
    function (err, rows, fields) {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (rows.length <= 0) {
        return res.status(401).json({ message: "Invalid Email!" });
      }

      const user = rows[0];

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res.status(401).json({ message: "Incorrect Password!" });
        }

        req.session.adminRole = user.role;
        req.session.userId = user.id;
        req.session.email = user.email;
        req.session.name = user.name;
        req.session.profile = user.profile;
        req.session.loggedin = true;

        return res.json({ message: "Login successful" });
      });
    });
});

module.exports = router;
