const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const projectName = "imageboard project";

// MULTER FROM SALT NOTES
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

const db = require("./utils/db");
const s3 = require("./s3");
// const s3middleware = require("./s3middleware");
// const awsS3middleware = require("./awsS3middleware");

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Vue code goes in public folder
app.use(express.static("./public"));

var diskStorage = multer.diskStorage({
    // figures out where on your HD the file should be saved - in this case "/uploads"
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    // filename method changes filename to make it unique
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    // resposible for for what we upload and where
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

// place after multer
app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    if (req.file) {
        console.log(
            ">>> POST > UPLOAD > req.file.filename:",
            req.file.filename
        );
        const bucketUrl = "https://s3.amazonaws.com/asimpletestbucket/images/";
        // let amazonUrl =
        //     "https://s3.amazonaws.com/spicedling/" + req.file.filename;
        // let amazonUrl =
        //     "https://imageboard101.s3.amazonaws.com/" + req.file.filename;
        // let amazonUrl =
        //     "http://s3-us-east-1.amazonaws.com/imageboard101/" +
        //     req.file.filename;
        let amazonUrl = bucketUrl + req.file.filename;
        console.log("req.body", req.body);
        const { description, username, title } = req.body;
        db.amazonInfo(amazonUrl, description, username, title)
            .then(results => {
                const { id } = results.rows[0];
                console.log("Id is...", id);
                res.json({
                    success: true,
                    id: id,
                    url: amazonUrl,
                    description: description,
                    username: username,
                    title: title
                });
                console.log("amazonUrl", amazonUrl);
            })
            .catch(err => {
                console.log("ERROR: ", err);
            });
    } else {
        res.json({
            success: false
        });
    }
});

// GET MODAL > INFO & COMMENTS
app.get("/get-image-info/:id", (req, res) => {
    console.log(">>> GET > MODAL INFO > req.params.id", req.params.id);
    db.modalInfo(req.params.id).then(imageResults => {
        db.getUserComments(req.params.id)
            .then(commentsResults => {
                res.json([imageResults.rows, commentsResults.rows]);
                // console.log("imageResults.rows", imageResults.rows[0].id);
            })
            .catch(err => {
                console.log(err);
            });
    });
});

// GET MORE IMAGES
app.get("/more/:id", (req, res) => {
    const { id } = req.params;
    console.log("req.params.id", id);
    db.getMoreImages(id)
        .then(results => {
            const { rows } = results;
            res.json(rows);
            // console.log("// loads more images > results.rows", rows);
        })
        .catch(err => {
            console.log(err);
        });
});

// POST COMMENTS
app.post("/uploadComment", (req, res) => {
    const { comment, username, id } = req.body;
    db.insertUserComments(comment, username, id).then(uploadResults => {
        console.log("results", uploadResults);
        res.json(uploadResults.rows[0]);
    });
});

// GET IMAGES
app.get("/images", (req, res) => {
    console.log(">>> GET > IMAGES");
    db.getImagesData()
        .then(results => {
            // console.log(">>> Get images data results", results);
            res.json(results.rows);
        })
        .catch(err => {
            console.log(err);
        });
});

app.listen(port, () =>
    console.log(
        `Hello, I've been expecting you, ${projectName}...listening on ${port}`
    )
);
