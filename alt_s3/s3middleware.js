const fs = require("fs");
// const fs = require("s3-fs");
const s3 = require("s3");

// var AWS = require("aws-sdk");
// const bucketName = "asimpletestbucket";

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // secrets.json is in .gitignore
}

const client = s3.createClient({
    maxAsyncS3: 20, // this is the default
    s3RetryCount: 3, // this is the default
    s3RetryDelay: 1000, // this is the default
    multipartUploadThreshold: 5971520, // this is the default (20 MB)
    s3Options: {
        accessKeyId: secrets.AWS_KEY,
        secretAccessKey: secrets.AWS_SECRET,
        region: "us-east-1"
    }
});
module.exports.upload = function(req, res, next) {
    console.log("req.file in s3", req.file);
    if (!req.file) {
        return res.sendStatus(500);
    } else {
        var params = {
            localFile: req.file.path,
            s3Params: {
                Bucket: "asimpletestbucket",
                Key: "images/" + req.file.filename
            }
        };
        console.log("params", params);
        var uploader = client.uploadFile(params);
        // //
        console.log("uploader", uploader);
        // // console.log("params.s3Params", params.s3Params);
        // const readStream = fs.createReadStream(req.file.path);
        // // // // console.log("req.file.path", req.file.path);
        // readStream.pipe(uploader);
        // // readstream = stream to Amazon

        uploader.on("error", function(err) {
            console.error("unable to upload:", err.stack);
        });
        uploader.on("progress", function() {
            console.log(
                "progress",
                uploader.progressMd5Amount,
                uploader.progressAmount,
                uploader.progressTotal
            );
        });
        uploader.on("end", function() {
            console.log("res.statusCode: ", res.statusCode);
            console.log(">>> Finished uploading");
            next();
        });
    }
}; // end upload
