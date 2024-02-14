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
        cb(null, "./public/partners");
    },


    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

// Create the multer instance and specify the storage
// const upload = multer({ storage }).single("partner_img");
const upload = multer({ storage: storage });

const partners = (req, res) => {
    if (req.session.loggedin === true) {
        dbConn.query(
            "SELECT * FROM partners ORDER BY pid DESC",
            function (err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    const adminAccess = req.session.userId;
                    res.render("partners", {
                        partnersDatas: rows,
                        activePage: "partners",
                    });
                }
            }
        );
    } else {
        res.redirect("/admin");
    }
};

const addPartner = (req, res) => {
    if (req.session.loggedin === true) {

        const adminAccess = req.session.userId;
        res.render("addPartner", {
            activePage: "addPartner",
        });

    } else {
        res.redirect("/admin");
    }
};


//add partners

const insertPartner = (req, res) => {


    upload.array('partner_imgs', 5)(req, res, (err) => { // assuming 'partner_imgs' is the name attribute of your multiple file input

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
            const { title, descp } = req.body;
            let errors = false;

            if (title == "") {
                errors = true;
                res.status(401).json({ message: "Title is empty!" });
            } else if (descp == "") {
                errors = true;
                res.status(401).json({ message: "description is empty!" });
            }

            if (!errors) {
                // check if category are already
                dbConn.query(
                    "SELECT * FROM partners WHERE title =" + "'" + title + "'",
                    function (err, rows, fields) {
                        if (err) throw err;

                        // if user not found
                        if (rows.length <= 0) {

                            if (req.files && req.files.length > 0) {

                                const imageName = req.files.map(file => file.filename); // Get an array of filenames
                                // const imageName = req.file.filename;

                                var form_data = {
                                    title: title,
                                    descp: descp,
                                    partner_img: imageName.join(', ') // Combine filenames into a comma-separated string

                                };
                            } else {
                                var form_data = {
                                    title: title,
                                    descp: descp,
                                    partner_img: "noImg.png",
                                };
                            }

                            dbConn.query(
                                "INSERT INTO partners SET ?",
                                form_data,
                                function (err, result) {
                                    //if(err) throw err
                                    if (err) {
                                        res.status(401).json({ message: "Error inserting partners!" });
                                    } else {
                                        res.json({ message: true });
                                    }
                                }
                            );
                        } else {
                            res.status(401).json({ message: "Title is already exists!" });
                        }
                    }
                );
            }
        }
    });
};



// Delete a partner
const delpartner = (req, res) => {
    const partnerId = req.params.id;

    let errors = false;

    if (partnerId == "") {
        errors = true;
        res.status(401).json({ message: "Partner Id is empty!" });
    }

    // Get the image filename from the database
    dbConn.query(
        "SELECT partner_img FROM partners WHERE pid = ?",
        [partnerId],
        (error, results) => {
            if (error) throw error;

            if (results.length > 0) {

                const dbimgnames = results[0].partner_img.split(', '); // Split filenames into an array
                //delete category
                dbConn.query(
                    "DELETE FROM partners WHERE pid = " + partnerId,
                    function (err, result) {
                        //if(err) throw err
                        if (err) {
                            res.status(401).json({ message: err });
                        } else {

                            dbimgnames.forEach(filename => {

                                const imagePath = `./public/partners/${filename}`;

                                if (filename != "noImg.png") {
                                    deleteImageFile(imagePath);
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

//edit partner

const editPartner = (req, res) => {

    const PartnerId = req.params.id;

    if (req.session.loggedin === true) {
        const query1 = "SELECT * FROM partners WHERE pid = " + PartnerId;
        dbConn.query(query1, (err, results1) => {
            if (err) {
                console.error("Error executing query 1: ", err);
                res.status(500).send("Error fetching data from partners");
                return;
            }

            const adminAccess = req.session.userId;
            res.render("editpartner", {
                Partnerdata: results1,
                activePage: "editPartner",
            });

        });
    } else {
        res.redirect("/admin");
    }
};




//update Partner

const updatePartner = function (req, res) {

    upload.array('partner_imgs', 5)(req, res, (err) => {

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
            const { title, descp, pid } = req.body;
            let errors = false;

            if (title == "") {
                errors = true;
                res.status(401).json({ message: "Title is empty!" });
            } else if (descp == "") {
                errors = true;
                res.status(401).json({ message: "description is empty!" });
            }

            if (!errors) {
                // check if category are already
                dbConn.query(
                    "SELECT * FROM partners WHERE title =" + "'" + title + "'",
                    function (err, rows, fields) {
                        if (err) throw err;

                        // if user not found
                        if (rows.length <= 1) {

                            if (req.files && req.files.length > 0) {

                                const imageName = req.files.map(file => file.filename);

                                var form_data = {
                                    title: title,
                                    descp: descp,
                                    partner_img: imageName.join(', '),
                                };

                                // Get the image filename from the database
                                dbConn.query(
                                    "SELECT partner_img FROM partners WHERE pid = ?",
                                    [pid],
                                    (error, results11) => {
                                        if (error) throw error;

                                        if (results11.length > 0) {
                                            const dbimgnames = results11[0].partner_img.split(', ');

                                            // console.log(dbimgname);
                                            dbimgnames.forEach(filename => {
                                                const imagePath = `./public/partners/${filename}`;
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
                                "UPDATE partners SET ? WHERE pid =" + pid,
                                form_data,
                                function (err, result) {
                                    //if(err) throw err
                                    console.log(err);

                                    if (err) {
                                        res.status(401).json({ message: "Error updating partners!22" });
                                    } else {
                                        res.json({ message: true });
                                    }
                                }
                            );
                        } else {
                            res.status(401).json({ message: "Title is already exists!" });
                        }
                    }
                );
            }
        }
    });
};

//create a function for remove files from the registry
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
    partners,
    addPartner,
    insertPartner,
    delpartner,
    editPartner,
    updatePartner,
};
