const knox = require("knox-s3");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // secrets.json is in .gitignore
}
const client = knox.createClient({
    key: secrets.AWS_KEY,
    secret: secrets.AWS_SECRET,
    bucket: "asimpletestbucket"
});

module.exports.upload = function(req, res, next) {
    console.log("req.file in s3", req.file);
    if (!req.file) {
        return res.sendStatus(500);
    }
    var s3Request = client.put(req.file.filename, {
        "Content-Type": req.file.mimetype,
        "Content-Length": req.file.size,
        "x-amz-acl": "public-read"
    });
    console.log("req.file.size", req.file.size);
    console.log("req.file.mimetype", req.file.mimetype);
    const readStream = fs.createReadStream(req.file.path);
    console.log("req.file.path", req.file.path);
    readStream.pipe(s3Request);

    s3Request.on("response", s3Response => {
        console.log("s3Response.statusCode: ", s3Response.statusCode);
        const wasSuccessful = s3Response.statusCode == 200;

        if (wasSuccessful) {
            res.json({
                success: true
            });
            next();
            console.log("image uploaded successfully");
        } else {
            // else block will run if I DIDNT successfully upload an image to AWS
            res.sendStatus(500);
            res.json({
                success: false
            });
        }
    });
    s3Request.on("error", function(error) {
        console.log("image upload failed", error);
    });
    // readstream = stream to Amazon
}; // end upload
