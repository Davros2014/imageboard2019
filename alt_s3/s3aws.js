const AWS = require("aws-sdk");
// const fs = require("s3-fs");
const fs = require("fs");

// const path = require("path");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // secrets.json is in .gitignore
}

AWS.config.update({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

let s3 = new AWS.S3();

async function getImage() {
    const data = s3
        .getObject({
            Bucket: "asimpletestbucket",
            Key: "images/" + req.file.filename
        })
        .promise();
    return data;
}
