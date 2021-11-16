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
    bucket: "imageboard2020" // my creds
});

module.exports.upload = function(req, res, next) {
    if (!req.file) {
        return res.sendStatus(500);
    }
    const s3Request = client.put(req.file.filename, {
        "Content-Type": req.file.mimetype,
        "Content-Length": req.file.size,
        "x-amz-acl": "public-read"
    });

    const readStream = fs.createReadStream(req.file.path);
    readStream.pipe(s3Request);

    s3Request.on("response", s3Response => {
        const wasSuccessful = s3Response.statusCode == 200;
        if (wasSuccessful) {
            next();
        } else {
            // else block will run if I DIDNT successfully upload an image to AWS
            res.sendStatus(500);
            // res.json({
            //     success: wasSuccessful
            // });
        }
    });
    // readstream = stream to Amazon
}; // end upload
