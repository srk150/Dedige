var dbConn = require("../config/db");
const nodemailer = require("nodemailer");

// Import required modules
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ejs = require('ejs');

const bcrypt = require("bcrypt");

let dotenv = require("dotenv").config();
const net = require('net');

//file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/cat");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
// Create the multer instance and specify the storage
const upload = multer({ storage }).single("catImg");

//slider storage

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/slider");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
// Create the multer instance and specify the storage
const upload2 = multer({ storage: storage2 }).single("slider");

const createCategory = (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error(err);
      res.status(500).json({ message: "An error occurred during file upload." });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.error(err);
      res
        .status(500)
        .json({ message: "An unknown error occurred during file upload." });
    } else {
      const { category } = req.body;
      let errors = false;

      if (category == "") {
        errors = true;
        res.status(401).json({ message: "Category is empty!" });
      }

      if (!errors) {
        // check if category are already
        dbConn.query(
          "SELECT * FROM category WHERE cat =" + "'" + category + "'",
          function (err, rows, fields) {
            if (err) throw err;

            // if user not found
            if (rows.length <= 0) {
              if (req.file) {
                const imageName = req.file.filename;

                var form_data = {
                  cat: category,
                  catImg: imageName,
                };
              } else {
                var form_data = {
                  cat: category,
                  catImg: "noImg.png",
                };
              }

              dbConn.query(
                "INSERT INTO category SET ?",
                form_data,
                function (err, result) {
                  //if(err) throw err
                  if (err) {
                    res
                      .status(401)
                      .json({ message: "Error inserting category!" });
                  } else {
                    res.json({ message: true });
                  }
                }
              );
            }
            // if user found
            else {
              res.status(401).json({ message: "Category is already exists!" });
            }
          }
        );
      }
    }
  });
};

const delCategory = (req, res) => {
  const categoryId = req.params.id;

  let errors = false;

  if (categoryId == "") {
    errors = true;
    res.status(401).json({ message: "Category Id is empty!" });
  }

  // Get the image filename from the database
  dbConn.query(
    "SELECT catImg FROM category WHERE id = ?",
    [categoryId],
    (error, results) => {
      if (error) throw error;

      if (results.length > 0) {
        const dbimgname = results[0].catImg;

        //delete category
        dbConn.query(
          "DELETE FROM category WHERE id = " + categoryId,
          function (err, result) {
            //if(err) throw err
            if (err) {
              res.status(401).json({ message: err });
            } else {
              const imagePath = `./public/cat/${dbimgname}`;
              if (dbimgname != "noImg.png") {
                deleteImageFile(imagePath);
              }

              res.json({ message: true });
            }
          }
        );
      } else {
        res.status(404).send("Entry not found");
      }
    }
  );
};


// update category
const updateCat = (req, res) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error(err);
      res.status(500).json({ message: "An error occurred during file upload." });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.error(err);
      res
        .status(500)
        .json({ message: "An unknown error occurred during file upload." });
    } else {
      const { category, id } = req.body;
      let errors = false;

      if (category == "") {
        errors = true;
        res.status(401).json({ message: "Category is empty!" });
      }

      if (!errors) {
        // check if category are already
        dbConn.query(
          "SELECT * FROM category WHERE cat =" + "'" + category + "'",
          function (err, rows, fields) {
            if (err) throw err;

            // if user not found
            if (rows.length <= 1) {
              if (req.file) {
                const imageName = req.file.filename;

                var form_data = {
                  cat: category,
                  catImg: imageName,
                };

                // Get the image filename from the database
                dbConn.query(
                  "SELECT catImg FROM category WHERE id = ?",
                  [id],
                  (error, results) => {
                    if (error) throw error;

                    if (results.length > 0) {
                      const dbimgname = results[0].catImg;

                      const imagePath = `./public/cat/${dbimgname}`;
                      if (dbimgname != "noImg.png") {
                        deleteImageFile(imagePath);
                      }
                    }
                  }
                );
              } else {
                var form_data = {
                  cat: category,
                };
              }

              dbConn.query(
                "UPDATE category SET ? WHERE id =" + id,
                form_data,
                function (err, result) {
                  //if(err) throw err
                  if (err) {
                    res
                      .status(401)
                      .json({ message: "Error inserting category!" });
                  } else {
                    res.json({ message: true });
                  }
                }
              );
            }
            // if user found
            else {
              res.status(401).json({ message: "Category is already exists!" });
            }
          }
        );
      }
    }
  });
};

// create a function for remove files from the registry
function deleteImageFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting image file: ${err}`);
    } else {
      console.log(`Deleted image file: ${filePath}`);
    }
  });
}

const forgotpass = (req, res) => {
  res.render("paswordforgot");
};

const contact = (req, res) => {
  if (req.session.loggedin === true) {
    dbConn.query("SELECT * FROM auth WHERE id =1", function (err, rows) {
      if (err) {
        res.redirect("/admin");
      } else {
        const adminAccess = req.session.userId;
        res.render("contact", {
          userName: rows[0].username,
          name: rows[0].name,
          email: rows[0].email,
          mobile: rows[0].mobile,
          role: rows[0].role,
          occupation: rows[0].occupation,
          activePage: "contact",
        });
      }
    });
  } else {
    res.redirect("/admin");
  }
};

const changepass = (req, res) => {
  res.render("chagePassword");
};

const updPassword = (req, res) => {
  const { pass, pass1 } = req.body;
  let errors = false;

  if (pass == "") {
    errors = true;
    res.status(401).json({ message: "Password is empty!" });
  } else if (pass1 == "") {
    errors = true;
    res.status(401).json({ message: "Confirm password is empty!" });
  } else if (pass != pass1) {
    errors = true;
    res
      .status(401)
      .json({ message: "Password and confirm password is not match!" });
  }

  if (!errors) {
    var form_data = {
      password: pass,
    };

    bcrypt
      .hash(pass, 8)
      .then((hash) => {
        //set the password to hash value
        form_data.password = hash;
      })
      .then(() => {
        dbConn.query(
          "UPDATE auth SET ? WHERE id =1",
          form_data,
          function (err, result) {
            //if(err) throw err
            if (err) {
              res.status(401).json({ message: "Error update password!" });
            } else {
              res.json({ message: true });
            }
          }
        );
      });
  }
};

const forgotPassword = (req, res) => {
  const { email } = req.body;

  let errors = false;

  if (email == "") {
    errors = true;
    res.status(401).json({ message: "Email is empty!" });
  }

  if (!errors) {
    // check if category are already
    dbConn.query(
      "SELECT * FROM auth WHERE email =" + "'" + email + "'",
      function (err, rows, fields) {
        if (err) throw err;

        // if user not found
        if (rows.length <= 0) {
          res.status(401).json({ message: "Email is not found!" });
        } else {
          // console.log(process.env.Smtp_email + "ok!");
          var tomail = rows[0].email;
          var name = rows[0].name;
          var subject = "Forgot password";

          var messages = "Please visit this link for your new password";

          var templateData = {
            to_email: tomail,
            name: name,
            subject: subject,
            messages: messages,
          };

          // Render the email template using EJS
          req.app.render(
            "template/forgot",
            templateData,
            (error, renderedTemplate) => {
              if (error) {
                console.error(error);
                return res
                  .status(500)
                  .send(
                    "An error occurred while rendering the email template."
                  );
              } else {
                // Send the email using Nodemailer
                sendEmail(
                  transporter,
                  tomail,
                  subject,
                  renderedTemplate,
                  (sendError, info) => {
                    if (sendError) {
                      console.error(sendError);
                      return res
                        .status(500)
                        .send("An error occurred while sending the email.");
                    }

                    res.json({ message: true });
                  }
                );
              }
            }
          );
        }
      }
    );
  }
};

const contact_user = (req, res) => {
  const { name, email, subject, msg } = req.body;
  let errors = false;

  if (name == "") {
    errors = true;
    res.status(401).json({ message: "Name is empty!" });
  } else if (email == "") {
    errors = true;
    res.status(401).json({ message: "E-mail is empty!" });
  } else if (subject == "") {
    errors = true;
    res.status(401).json({ message: "Subject is empty!" });
  } else if (msg == "") {
    errors = true;
    res.status(401).json({ message: "Message is empty!" });
  }

  if (!errors) {

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


    // Define email options
    let mailOptions = {
      from: process.env.Smtp_email,
      to: email, //admin mail
      subject: subject
    };

    // Render EJS template file
    const emailTemplatePath = path.join(__dirname, '..', 'views', 'template', 'adminNotice.ejs');

    // Render EJS template file
    ejs.renderFile(emailTemplatePath, { to_email: email, subject: subject, messages: msg, name: name, }, (err, data) => {


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
        res.json({ message: true });
        // res.status(200).json({ message: 'Successfully sent the enquiry!', status: "true" });

      });
    });

  }
};




const AdminSettings = (req, res) => {
  if (req.session.loggedin === true) {
    const query1 =
      "SELECT access.*, auth.name AS auth_name FROM access JOIN auth on auth.id = access.adminId WHERE access.adminId!=1";
    dbConn.query(query1, (err, results1) => {
      if (err) {
        console.error("Error executing query 1: ", err);
        res.status(500).send("Error fetching data");
        return;
      }

      dbConn.query(
        "SELECT * FROM auth WHERE role !='superadmin'",
        function (err, rows) {
          if (err) {
            res.redirect("/admin");
          } else {
            const adminAccess = req.session.userId;
            res.render("adminsettings", {
              adminData: rows,
              accessData: results1,
              activePage: "settings",
            });
          }
        }
      );
    });
  } else {
    res.redirect("/admin");
  }
};

const accessAdmin = (req, res) => {
  const adminName = req.body.adminName;
  const checkboxes = req.body.accessMenu;

  let errors = false;

  if (adminName == "") {
    errors = true;
    res.status(401).json({ message: "Please select admin!" });
  } else if (!checkboxes || checkboxes.length === 0) {
    errors = true;
    return res
      .status(400)
      .json({ message: "Please select at least one checkbox." });
  }

  if (!errors) {
    // check if admin is already
    dbConn.query(
      "SELECT * FROM access WHERE adminId =" + "'" + adminName + "'",
      function (err, rows, fields) {
        if (err) throw err;

        // if user not found
        if (rows.length <= 0) {
          const accessMenuArray = checkboxes.join(",");

          var form_data = {
            adminId: adminName,
            menu: accessMenuArray,
          };

          dbConn.query(
            "INSERT INTO access SET ?",
            form_data,
            function (err, result) {
              //if(err) throw err
              if (err) {
                res.status(401).json({ message: "Error inserting !" });
              } else {
                res.json({ message: true, status: "Added Successfully!" });
              }
            }
          );
        } else {
          const accessMenuArray = checkboxes.join(",");

          var form_data = {
            menu: accessMenuArray,
          };

          dbConn.query(
            "UPDATE access SET ? WHERE adminId =" + adminName,
            form_data,
            function (err, result) {
              //if(err) throw err
              if (err) {
                res.status(401).json({ message: "Error updating!" });
              } else {
                res.json({ message: true, status: "Updated Successfully!" });
              }
            }
          );
        }
      }
    );
  }
};

const approveReviews = (req, res) => {
  const reviewId = req.params.id;

  let errors = false;

  if (reviewId == "") {
    errors = true;
    res.status(401).json({ message: "Review Id is empty!" });
  }

  var form_data = {
    status: 1,
  };

  //update status of the review approved

  dbConn.query(
    "UPDATE reviews SET status = !status WHERE id =" + reviewId,
    function (err, result) {
      //if(err) throw err
      if (err) {
        res.status(401).json({ message: "Error update review !" });
      } else {
        res.json({ message: true });
      }
    }
  );
};

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



module.exports = {
  createCategory,
  delCategory,
  updateCat,
  forgotpass,
  forgotPassword,
  changepass,
  updPassword,
  contact,
  contact_user,
  AdminSettings,
  accessAdmin,
  approveReviews,

};
