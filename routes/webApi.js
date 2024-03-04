const express = require("express");
const router = express.Router();
const dbConn = require("../config/db");
const bcrypt = require("bcrypt");

// Import required modules
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const nodemailer = require("nodemailer");
let dotenv = require("dotenv").config();

// email transport
const transporter = nodemailer.createTransport({
  host: 'mail.didige.in',
  port: 465,
  secure: true, // Enable TLS/SSL encryption
  auth: {
    user: "info@didige.in",
    pass: "didige12345",
  },
});




//for path files using multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage: storage });

//contact mail for admin
router.post("/contactApiForAmin", function (req, res) {

  const { email, mobile, request } = req.body;

  let errors = false;

  if (email == "") {
    errors = true;
    res.status(401).json({ message: "Email is empty!" });
  } else if (mobile == "") {
    errors = true;
    res.status(401).json({ message: "Mobile is empty!" });
  } else if (request == "") {
    errors = true;
    res.status(401).json({ message: "Request is empty!" });
  }

  if (!errors) {
    //admin email
    const adminMail = "sharukh24524@gmail.com";
    const userMail = email;
    const subject = "Contact Inquiry From Website!";

    var adminTemplateData = {
      to_email: userMail,
      subject: subject,
      messages: request,
      mobile: mobile,
    };



    // Render the email template using EJS for admin
    req.app.render(
      "template/adminInquiry",
      adminTemplateData,
      (adminError, adminRenderedTemplate) => {
        if (adminError) {
          console.error(adminError);
          return res
            .status(500)
            .send("An error occurred while rendering the admin email template.");
        } else {
          // Send the email for admin 
          sendEmail(
            transporter,
            adminMail,
            subject,
            adminRenderedTemplate,
            (adminSendError, adminInfo) => {
              if (adminSendError) {
                console.error(adminSendError);
                return res
                  .status(500)
                  .send("An error occurred while sending the admin email.");
              }


              // Render the email template using EJS for user
              req.app.render(
                "template/userInquiry",
                adminTemplateData,
                (userError, userRenderedTemplate) => {
                  if (userError) {
                    console.error(userError);
                    return res
                      .status(500)
                      .send("An error occurred while rendering the user email template.");
                  } else {
                    // Send the email for user 
                    sendEmail(
                      transporter,
                      userMail,
                      subject,
                      userRenderedTemplate,
                      (userSendError, userInfo) => {
                        if (userSendError) {
                          console.error(userSendError);
                          return res
                            .status(500)
                            .send("An error occurred while sending the user email.");
                        }

                        res.json({ message: "Successfully sent the enquiry", status: "true" });
                      }
                    );
                  }
                }
              );
            }
          );
        }
      }
    );
  }
});


//portfolio List
router.get("/portfolioList", function (req, res) {

  const query = 'SELECT * FROM portfolio ORDER BY id ASC';

  dbConn.query(query, (err, results) => {
    if (err) {
      console.error('Error executing portfolio query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });

});

//partnerList 
router.get("/partnerList", function (req, res) {

  const query = 'SELECT * FROM partners ORDER BY pid ASC';

  dbConn.query(query, (err, results) => {
    if (err) {
      console.error('Error executing partners query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });

});


//email function send
function sendEmail(transporter, form_data, subject, html, callback) {
  const from_email = process.env.Smtp_email;
  transporter.sendMail(
    {
      from: from_email,
      to: form_data,
      subject,
      html,
    },
    (error, info) => {
      callback(error, info);
    }
  );
}

module.exports = router;