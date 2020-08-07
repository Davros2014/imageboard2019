const AWS = require("aws-sdk");
// const fs = require("s3-fs");
const fs = require("fs");

const path = require("path");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // secrets.json is in .gitignore
}

//configuring the AWS environment
AWS.config.update({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "us-east-1"
});

module.exports.upload = function(req, res, next) {
    console.log("req.file in s3", req.file);
    if (!req.file) {
        return res.sendStatus(500);
    } else {
        var client = new AWS.S3();
        var filePath = req.file.path;
        var file = req.file.filename;
        //configuring parameters
        var params = {
            Bucket: "asimpletestbucket",
            Body: fs.createReadStream(req.file.path),
            Key: "/images/" + req.file.filename
        };

        var uploader = client.upload(params);

        const readStream = params.Body;
        readStream.pipe(uploader);

        uploader.on("response", function() {
            console.log("s3Response.statusCode: ", res.statusCode);
            const wasSuccessful = res.statusCode == 200;
            if (wasSuccessful) {
                console.log("image uploaded successfully");
                next();
            } else {
                // else block will run if I DIDNT successfully upload an image to AWS
                res.sendStatus(500);
                // res.json({
                //     success: wasSuccessful
                // });
            }
        });
        uploader.on("error", function(err) {
            //handle error
            console.log("Sorry, unable to upload", err);
        });
    }
}; // end upload
