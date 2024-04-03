var dbConn = require("../config/db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

const nodemailer = require("nodemailer");
const { exit } = require("process");
const { log } = require("console");
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
    "SELECT pimg, logo, logo2, logo3, logo4 FROM portfolio WHERE id = ?",
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
              // const dbimgname = results[0].pimg;

              // const imagePath = `./public/portfolio/${dbimgname}`;
              // if (dbimgname != "noImg.png") {
              //   deleteImageFile(imagePath);
              // }

              const dbimgnameportfolio = results[0].pimg.split(', ');
              dbimgnameportfolio.forEach(filename3 => {
                const imagePath3 = `./public/portfolio/${filename3}`;
                if (filename3 != "noImg.png") {
                  deleteImageFile(imagePath3);
                }
              });


              //logo image delete
              const dbimgLogo = results[0].logo.split(', ');

              const dbimgLogo2 = results[0].logo2;
              const dbimgLogo3 = results[0].logo3;
              const dbimgLogo4 = results[0].logo4;


              dbimgLogo.forEach(filename2 => {
                const imagePath2 = `./public/portfolio/${filename2}`;
                if (filename2 != "noImg.png") {
                  deleteImageFile(imagePath2);
                }
              });

              //logo2
              if (dbimgLogo2) {
                const imagePath21 = `./public/portfolio/${dbimgLogo2}`;
                if (dbimgLogo2 !== "noImg.png") {
                  // Handle the deletion of a single image
                  deleteImageFile(imagePath21);
                }
              }
              //logo3
              if (dbimgLogo3) {
                const imagePath31 = `./public/portfolio/${dbimgLogo3}`;
                if (dbimgLogo3 !== "noImg.png") {
                  // Handle the deletion of a single image
                  deleteImageFile(imagePath31);
                }
              }

              //logo4
              if (dbimgLogo4) {
                const imagePath4 = `./public/portfolio/${dbimgLogo4}`;
                if (dbimgLogo4 !== "noImg.png") {
                  // Handle the deletion of a single image
                  deleteImageFile(imagePath4);
                }
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

// insert Portfolio
// const insertPortfolio = (req, res) => {

//   upload.fields([{ name: 'pimg', maxCount: 5 }, { name: 'logo', maxCount: 5 }])(req, res, (err) => {

//     if (err) {
//       console.error(err);
//       return res.status(500).json({ message: "An error occurred during file upload." });
//     }

//     const { title, descp, type } = req.body;

//     // Access uploaded files
//     const pimgFiles = req.files['pimg'];
//     const logoFiles = req.files['logo'];

//     const pimgFilenames = pimgFiles.map(file => file.filename);
//     const logoFilenames = logoFiles.map(file => file.filename);

//     console.log(logoFilenames);
//     exit;


//     // if (title == "") {
//     //   errors = true;
//     //   res.status(401).json({ message: "Title is empty!" });
//     // } else if (descp == "") {
//     //   errors = true;
//     //   res.status(401).json({ message: "description is empty!" });
//     // } else if (!req.files['pimg']) {
//     //   errors = true;
//     //   return res.status(401).json({ message: "Portfolio image is required!" });
//     // } else if (!req.files['logo']) {
//     //   errors = true;
//     //   return res.status(401).json({ message: "Logo image is required!" });
//     // }



//     // check if category are already
//     dbConn.query(
//       "SELECT * FROM portfolio WHERE title =" + "'" + title + "'",
//       function (err, rows, fields) {
//         if (err) throw err;

//         // if user not found
//         if (rows.length <= 0) {


//           // const logoImage = req.files['logo'].map(file => file.filename);
//           const logoImage = req.files.map(file => file.filename); // Get an array of filenames

//           // const logoImage = req.files['logo'].filename;
//           // const logoImage2 = req.files['logo2'].filename;
//           // const logoImage3 = req.files['logo3'].filename;
//           // const logoImage4 = req.files['logo4'].filename;

//           const partnerImages = req.files['pimg'].map(file => file.filename);
//           // const partnerImages = req.files['pimg'] ? req.files['pimg'][0].filename : "noImg.png";

//           var form_data = {
//             title: title,
//             descp: descp,
//             type: type,
//             logo: logoImage.join(', '),
//             // logo: logoImage,
//             // logo2: logoImage2,
//             // logo3: logoImage3,
//             // logo4: logoImage4,
//             pimg: partnerImages.join(', '),
//             // pimg: partnerImages
//           };

//           dbConn.query(
//             "INSERT INTO portfolio SET ?",
//             form_data,
//             function (err, result) {
//               //if(err) throw err
//               if (err) {
//                 res.status(401).json({ message: "Error inserting portfolio!" });
//               } else {
//                 res.json({ message: true });
//               }
//             }
//           );

//         } else {

//           res.status(401).json({ message: "portfolio name is already exists!" });
//         }
//       }
//     );

//   });
// };

const insertPortfolio = (req, res) => {

  upload.fields([{ name: 'pimg', maxCount: 5 }, { name: 'logo', maxCount: 1 }, { name: 'logo2', maxCount: 1 }, { name: 'logo3', maxCount: 1 }, { name: 'logo4', maxCount: 1 }])(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ message: "An error occurred during file upload." });
    }

    const { title, descp, type, url, url2, url3, url4 } = req.body;

    if (!title || !descp || !type) {
      return res.status(400).json({ message: "Title, description, and type are required fields." });
    }

    const pimgFiles = req.files['pimg'];
    const logoFiles = req.files['logo'];

    const logoFiles2 = req.files['logo2'];
    const logoFiles3 = req.files['logo3'];
    const logoFiles4 = req.files['logo4'];

    if (!pimgFiles) {
      return res.status(400).json({ message: "Portfolio images are required." });
    }

    const pimgFilenames = pimgFiles.map(file => file.filename);
    const logoFilenames = logoFiles.map(file => file.filename);


    const logoFilenames2 = logoFiles2 && logoFiles2.length > 0 ? logoFiles2.map(file => file.filename) : ['noImg.png'];
    const logoFilenames3 = logoFiles3 && logoFiles3.length > 0 ? logoFiles3.map(file => file.filename) : ['noImg.png'];
    const logoFilenames4 = logoFiles4 && logoFiles4.length > 0 ? logoFiles4.map(file => file.filename) : ['noImg.png'];


    // Check if portfolio with the same title already exists
    dbConn.query("SELECT * FROM portfolio WHERE title = ?", [title], function (err, rows) {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ message: "An error occurred while checking portfolio existence." });
      }

      if (rows.length > 0) {
        return res.status(400).json({ message: "Portfolio with the same title already exists." });
      }

      // Insert new portfolio entry
      const sql = "INSERT INTO portfolio (title, descp, type, url, url2, url3, url4, logo, logo2, logo3, logo4, pimg) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [title, descp, type, url, url2, url3, url4, logoFilenames, logoFilenames2, logoFilenames3, logoFilenames4, pimgFilenames.join(', ')];

      dbConn.query(sql, values, function (err, result) {
        if (err) {
          console.error("Database insert error:", err);
          return res.status(500).json({ message: "Error inserting portfolio into the database." });
        }

        res.json({ message: "Portfolio inserted successfully.", portfolioId: result.insertId });
      });
    });
  });
};


// update portfolio
const updatePortfolio = function (req, res) {

  upload.fields([{ name: 'pimg', maxCount: 5 }, { name: 'logo', maxCount: 1 }, { name: 'logo2', maxCount: 1 }, { name: 'logo3', maxCount: 1 }, { name: 'logo4', maxCount: 1 }])(req, res, (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(500).json({ message: "An error occurred during file upload." });
    }


    const { title, descp, pid, type, url, url2, url3, url4 } = req.body;


    if (!title || !descp || !type) {
      return res.status(400).json({ message: "Title, description, and type are required fields." });
    }

    const pimgFiles = req.files['pimg'];
    const logoFiles = req.files['logo'];

    const logoFiles2 = req.files['logo2'];
    const logoFiles3 = req.files['logo3'];
    const logoFiles4 = req.files['logo4'];

    // Check if portfolio with the same title already exists
    dbConn.query("SELECT * FROM portfolio WHERE id = ?", [pid], function (err2, rows2) {
      if (err2) {
        console.error("Database query error:", err2);
        return res.status(500).json({ message: "An error occurred while checking portfolio existence." });
      }

      if (rows2.length === 0) {
        return res.status(404).json({ message: "Portfolio not found." });
      }

      // Portfolio found, handle the result 
      const portfolioData = rows2[0];

      let newPimg = '';
      if (pimgFiles && pimgFiles.length > 0) {

        const pimgFilenames = pimgFiles.map(file => file.filename);
        newPimg = pimgFilenames.join(', ');

      } else {

        newPimg = portfolioData.pimg;

      }

      const logoFilenames = logoFiles && logoFiles.length > 0 ? logoFiles.map(file => file.filename) : portfolioData.logo;

      const logoFilenames2 = logoFiles2 && logoFiles2.length > 0 ? logoFiles2.map(file => file.filename) : portfolioData.logo2;
      const logoFilenames3 = logoFiles3 && logoFiles3.length > 0 ? logoFiles3.map(file => file.filename) : portfolioData.logo3;
      const logoFilenames4 = logoFiles4 && logoFiles4.length > 0 ? logoFiles4.map(file => file.filename) : portfolioData.logo4;

      // Check if portfolio with the same title already exists
      dbConn.query("SELECT * FROM portfolio WHERE title = ?", [title], function (err, rows) {
        if (err) {
          console.error("Database query error:", err);
          return res.status(500).json({ message: "An error occurred while checking portfolio existence." });
        }

        if (rows.length > 1) {
          return res.status(400).json({ message: "Portfolio with the same title already exists." });
        }

        // Update portfolio entry
        const sql = "UPDATE portfolio SET title = ?, descp = ?, type = ?, url = ?, url2 = ?, url3 = ?, url4 = ?, logo = ?, logo2 = ?, logo3 = ?, logo4 = ?, pimg = ? WHERE id = ?";
        const values = [title, descp, type, url, url2, url3, url4, logoFilenames, logoFilenames2, logoFilenames3, logoFilenames4, newPimg, pid];

        dbConn.query(sql, values, function (err, result) {
          if (err) {
            console.error("Database update error:", err);
            return res.status(500).json({ message: "Error updating portfolio in the database." });
          }

          res.json({ message: "Portfolio updated successfully." });
        });

      }); //get portf

    });
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
