// const fs = require("fs");
// const AWS = require("aws-sdk");
//
// const s3 = new AWS.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
// });
//
// const fileName = "contacts.csv";
//
// const uploadFile = () => {
//     fs.readFile(fileName, (err, data) => {
//         console.log("data is", data);
//
//         if (err) throw err;
//         const params = {
//             Bucket: "asimpletestbucket", // pass your bucket name
//             Key: "images/" + "contacts.csv", // file will be saved as testBucket/contacts.csv
//             Body: JSON.stringify(data, null, 2)
//         };
//         s3.upload(params, function(s3Err, data) {
//             if (s3Err) throw s3Err;
//             console.log(`File uploaded successfully at ${data.Location}`);
//         });
//     });
// };
//
// uploadFile();

const fs = require("fs");
const AWS = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // secrets.json is in .gitignore
}

const s3 = new AWS.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

const fileName = "image.png";

const uploadFile = () => {
    fs.readFile(fileName, (err, data) => {
        console.log("data is", data);
        if (err) throw err;
        const params = {
            Bucket: "asimpletestbucket", // pass your bucket name
            Key: "images/" + "image.png", // file will be saved as testBucket/contacts.csv
            Body: fs.createReadStream(fileName)
        };
        s3.upload(params, function(s3Err, data) {
            if (s3Err) throw s3Err;
            console.log(`File uploaded successfully at ${data.Location}`);
        });
    });
};

uploadFile();
