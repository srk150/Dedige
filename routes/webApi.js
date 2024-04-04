const express = require("express");
const router = express.Router();
const dbConn = require("../config/db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Import required modules
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ejs = require('ejs');

let dotenv = require("dotenv").config();

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

router.post("/contactApiForAdmin", function (req, res) {

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

    res.status(200).json({ message: 'Successfully sent the enquiry!', status: "true" });

    // Send email in the background
    sendEmailInBackground(email, mobile, request);


  }
});

function sendEmailInBackground(email, mobile, request) {

  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.Smtp_host,
    port: 465,
    secure: true,
    auth: {
      user: process.env.Smtp_email,
      pass: process.env.Smtp_passwrod
    }
  });

  const subject = "Contact Inquiry From Website!";

  // Define email options
  let mailOptions = {
    from: process.env.Smtp_email,
    to: 'sharukh24524@gmail.com', //admin mail
    subject: subject
  };

  // Render EJS template file
  const emailTemplatePath = path.join(__dirname, '..', 'views', 'template', 'adminInquiry.ejs');

  // Render EJS template file
  ejs.renderFile(emailTemplatePath, { to_email: email, subject: subject, messages: request, mobile: mobile }, (err, data) => {


    if (err) {
      console.error('Error rendering email template:', err);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    // Set HTML content for email
    mailOptions.html = data;

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ message: 'Error sending email' });
        return;
      }
      console.log('Message sent:', info.response);
      // console.log('Message sent:', info);
      // res.status(200).json({ message: 'Successfully sent the enquiry!', status: "true" });

    });
  });

}


//portfolio List
router.get("/portfolioList", function (req, res) {

  const query = 'SELECT * FROM portfolio ORDER BY id ASC';

  dbConn.query(query, (err, results) => {
    if (err) {
      console.error('Error executing portfolio query:', err);
      res.status(500).json({ error: 'Internal Server Error' });

    } else {

      const transformedResults = results.map(item => ({
        id: item.id,
        type: item.type,
        title: item.title,
        descp: item.descp,
        pimg: item.pimg,
        logo_image: [
          { logo: item.logo, url: item.url },
          { logo: item.logo2, url: item.url2 },
          { logo: item.logo3, url: item.url3 },
          { logo: item.logo4, url: item.url4 }
        ]

      }));


      res.json(transformedResults);

      // res.json(results);
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


//old contact email
// router.post("/contactApiForAdmin", function (req, res) {

//   const { email, mobile, request } = req.body;

//   let errors = false;

//   if (email == "") {
//     errors = true;
//     res.status(401).json({ message: "Email is empty!" });
//   } else if (mobile == "") {
//     errors = true;
//     res.status(401).json({ message: "Mobile is empty!" });
//   } else if (request == "") {
//     errors = true;
//     res.status(401).json({ message: "Request is empty!" });
//   }
//   if (!errors) {

//     // Create a transporter object using SMTP transport
//     let transporter = nodemailer.createTransport({
//       host: process.env.Smtp_host,
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.Smtp_email,
//         pass: process.env.Smtp_passwrod
//       }
//     });

//     const subject = "Contact Inquiry From Website!";

//     // Define email options
//     let mailOptions = {
//       from: process.env.Smtp_email,
//       to: 'sharukh24524@gmail.com', //admin mail
//       subject: subject
//     };

//     // Render EJS template file
//     const emailTemplatePath = path.join(__dirname, '..', 'views', 'template', 'adminInquiry.ejs');

//     // Render EJS template file
//     ejs.renderFile(emailTemplatePath, { to_email: email, subject: subject, messages: request, mobile: mobile }, (err, data) => {


//       if (err) {
//         console.error('Error rendering email template:', err);
//         res.status(500).json({ message: 'Internal server error' });
//         return;
//       }

//       // Set HTML content for email
//       mailOptions.html = data;

//       // Send email
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.error('Error occurred:', error);
//           res.status(500).json({ message: 'Error sending email' });
//           return;
//         }
//         console.log('Message sent:', info.response);
//         // console.log('Message sent:', info);
//         res.status(200).json({ message: 'Successfully sent the enquiry!', status: "true" });

//       });
//     });
//   }
// });


// email function send
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