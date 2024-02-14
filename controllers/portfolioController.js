var dbConn = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");
let dotenv = require("dotenv").config();

//file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/portfolio");
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

//portfolio list
const portfolio = (req, res) => {
  if (req.session.loggedin === true) {
    dbConn.query(
      "SELECT * FROM portfolio ORDER BY id DESC",
      function (err, rows) {
        if (err) {
          console.log(err);
        } else {
          const adminAccess = req.session.userId;
          res.render("portfolio", {
            portfolioDatas: rows,
            activePage: "portfolio",
          });
        }
      }
    );
  } else {
    res.redirect("/admin");
  }
};

const addPortfolio = (req, res) => {
  if (req.session.loggedin === true) {

    const adminAccess = req.session.userId;
    res.render("addPortfolio", {
      activePage: "addPortfolio",
    });

  } else {
    res.redirect("/admin");
  }
};

const editPortfolio = (req, res) => {
  const PortfolioId = req.params.id;

  if (req.session.loggedin === true) {
    const query1 = "SELECT * FROM portfolio WHERE id = " + PortfolioId;
    dbConn.query(query1, (err, results1) => {
      if (err) {
        console.error("Error executing query 1: ", err);
        res.status(500).send("Error fetching data from Portfolio");
        return;
      }

      const adminAccess = req.session.userId;
      res.render("editPortfolio", {
        Portfoliodata: results1,
        activePage: "editPortfolio",
      });

    });
  } else {
    res.redirect("/admin");
  }
};

//Delete a service
const delportfolio = (req, res) => {
  const portfolioId = req.params.id;

  let errors = false;

  if (portfolioId == "") {
    errors = true;
    res.status(401).json({ message: "Portfolio Id is empty!" });
  }

  // Get the image filename from the database
  dbConn.query(
    "SELECT pimg, logo FROM portfolio WHERE id = ?",
    [portfolioId],
    (error, results) => {
      if (error) throw error;

      if (results.length > 0) {

        //delete 
        dbConn.query(
          "DELETE FROM portfolio WHERE id = " + portfolioId,
          function (err, result) {
            //if(err) throw err
            if (err) {
              res.status(401).json({ message: err });
            } else {
              //pimg delete
              const dbimgname = results[0].pimg;

              const imagePath = `./public/portfolio/${dbimgname}`;
              if (dbimgname != "noImg.png") {
                deleteImageFile(imagePath);
              }

              //logo image delete
              const dbimgLogo = results[0].logo.split(', ');
              console.log(dbimgLogo);

              dbimgLogo.forEach(filename2 => {
                const imagePath2 = `./public/portfolio/${filename2}`;
                if (filename2 != "noImg.png") {
                  deleteImageFile(imagePath2);
                }
              });

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

// insert Portfolio
const insertPortfolio = (req, res) => {

  upload.fields([{ name: 'pimg', maxCount: 1 }, { name: 'logo', maxCount: 5 }])(req, res, (err) => {

    if (err instanceof multer.MulterError) {

      res.status(500).json({ message: "An error occurred during file upload." });
    } else if (err) {

      res.status(500).json({ message: "An unknown error occurred during file upload." });

    } else {

      const { title, descp } = req.body;

      let errors = false;

      // if (title == "") {
      //   errors = true;
      //   res.status(401).json({ message: "Title is empty!" });
      // } else if (descp == "") {
      //   errors = true;
      //   res.status(401).json({ message: "description is empty!" });
      // } else if (!req.files['pimg']) {
      //   errors = true;
      //   return res.status(401).json({ message: "Portfolio image is required!" });
      // } else if (!req.files['logo']) {
      //   errors = true;
      //   return res.status(401).json({ message: "Logo image is required!" });
      // }


      if (!errors) {

        // check if category are already
        dbConn.query(
          "SELECT * FROM portfolio WHERE title =" + "'" + title + "'",
          function (err, rows, fields) {
            if (err) throw err;

            // if user not found
            if (rows.length <= 0) {

              const logoImage = req.files['logo'].map(file => file.filename);
              const partnerImages = req.files['pimg'] ? req.files['pimg'][0].filename : "noImg.png";

              var form_data = {
                title: title,
                descp: descp,
                logo: logoImage.join(', '),
                pimg: partnerImages
              };

              dbConn.query(
                "INSERT INTO portfolio SET ?",
                form_data,
                function (err, result) {
                  //if(err) throw err
                  if (err) {
                    res.status(401).json({ message: "Error inserting portfolio!" });
                  } else {
                    res.json({ message: true });
                  }
                }
              );

            } else {

              res.status(401).json({ message: "portfolio name is already exists!" });
            }
          }
        );

      }


    }//img

  });
};

// update portfolio
const updatePortfolio = function (req, res) {

  upload.fields([{ name: 'pimg', maxCount: 1 }, { name: 'logo', maxCount: 5 }])(req, res, (err) => {

    if (err instanceof multer.MulterError) {
      res.status(500).json({ message: "An error occurred during file upload." });
    } else if (err) {
      res.status(500).json({ message: "An unknown error occurred during file upload." });
    } else {

      const { title, descp, pid } = req.body;
      let errors = false;

      // if (title == "") {
      //   errors = true;
      //   res.status(401).json({ message: "Title is empty!" });
      // } else if (descp == "") {
      //   errors = true;
      //   res.status(401).json({ message: "description is empty!" });
      // } else if (!req.files['pimg']) {
      //   errors = true;
      //   return res.status(401).json({ message: "Portfolio image is required!" });
      // } else if (!req.files['logo']) {
      //   errors = true;
      //   return res.status(401).json({ message: "Logo image is required!" });
      // }


      if (!errors) {
        // check if category are already
        dbConn.query(
          "SELECT * FROM portfolio WHERE title =" + "'" + title + "'",
          function (err, rows, fields) {
            if (err) throw err;

            // if user not found
            if (rows.length <= 1) {

              if (req.files['pimg'] && req.files['logo']) {

                const partnerImages = req.files['pimg'] ? req.files['pimg'][0].filename : "noImg.png";
                const logoImage = req.files['logo'].map(file => file.filename);

                var form_data = {
                  title: title,
                  descp: descp,
                  pimg: partnerImages,
                  logo: logoImage.join(', '),
                };


                // Get the image filename from the database
                dbConn.query(
                  "SELECT pimg,logo FROM portfolio WHERE id = ?",
                  [pid],
                  (error, results) => {
                    if (error) throw error;

                    if (results.length > 0) {

                      //pimg image delete
                      const dbimgname = results[0].pimg;
                      const imagePath = `./public/portfolio/${dbimgname}`;
                      if (dbimgname != "noImg.png") {
                        deleteImageFile(imagePath);
                      }

                      //logo image delete
                      const dbimgLogo = results[0].logo.split(', ');
                      dbimgLogo.forEach(filename2 => {
                        const imagePath2 = `./public/portfolio/${filename2}`;
                        if (filename2 != "noImg.png") {
                          deleteImageFile(imagePath2);
                        }
                      });


                    }
                  }
                );



              } else if (req.files['pimg'] && !req.files['logo']) {

                const partnerImages = req.files['pimg'] ? req.files['pimg'][0].filename : "noImg.png";

                var form_data = {
                  title: title,
                  descp: descp,
                  pimg: partnerImages,
                };

                // Get the image filename from the database
                dbConn.query(
                  "SELECT pimg FROM portfolio WHERE id = ?",
                  [pid],
                  (error, results) => {
                    if (error) throw error;

                    if (results.length > 0) {
                      const dbimgname = results[0].pimg;
                      const imagePath = `./public/portfolio/${dbimgname}`;
                      if (dbimgname != "noImg.png") {
                        deleteImageFile(imagePath);
                      }
                    }
                  }
                );
              } else if (req.files['logo'] && !req.files['pimg']) {

                const logoImage = req.files['logo'].map(file => file.filename);

                var form_data = {
                  title: title,
                  descp: descp,
                  logo: logoImage.join(', '),
                };

                // Get the image filename from the database
                dbConn.query(
                  "SELECT logo FROM portfolio WHERE id = ?",
                  [pid],
                  (error, results) => {
                    if (error) throw error;

                    if (results.length > 0) {

                      const dbimgnames = results[0].logo.split(', ');
                      dbimgnames.forEach(filename => {
                        const imagePath = `./public/portfolio/${filename}`;
                        if (filename != "noImg.png") {
                          deleteImageFile(imagePath);
                        }
                      });
                    }
                  }
                );
              } else {

                var form_data = {
                  title: title,
                  descp: descp,
                };
              }

              dbConn.query(
                "UPDATE portfolio SET ? WHERE id =" + pid,
                form_data,
                function (err, result) {
                  //if(err) throw err
                  if (err) {
                    res
                      .status(401)
                      .json({ message: "Error updating portfolio!" });
                  } else {
                    res.json({ message: true });
                  }
                }
              );
            } else {
              res.status(401).json({ message: "portfolio title is already exists!" });
            }
          }
        );
      }
    }//img
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

module.exports = {
  portfolio,
  delportfolio,
  addPortfolio,
  insertPortfolio,
  editPortfolio,
  updatePortfolio,
};
