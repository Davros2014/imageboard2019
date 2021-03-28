var spicedPg = require("spiced-pg");

const dbUrl =
    process.env.DATABASE_URL ||
    "postgres:postgres:postgres@localhost:5432/salt-imageboard";

const db = spicedPg(dbUrl);

// TO GET ALL IMAGE INFORMATION FROM IMAGES TABLE
module.exports.getImagesData = function getImagesData() {
    return db.query(
        `
        SELECT *, (
       SELECT id FROM images
       ORDER BY id ASC
       LIMIT 1)
       AS lowest_id FROM images
        WHERE id < 18
        ORDER BY id DESC
        LIMIT 9
        ;`
    );
};
// FOR ADDING ADDITIONAL IMAGES TO MAIN IMAGEBOARD
module.exports.getMoreImages = function getMoreImages(id) {
    return db.query(
        `SELECT *, (
       SELECT id FROM images
       ORDER BY id ASC
       LIMIT 1)
       AS lowest_id FROM images
       WHERE id < $1
       ORDER BY id DESC
       LIMIT 3;`,
        [id]
    );
};

// INPUTS TO IMAGES TABLE WHERE USER INPUTS DATA
module.exports.amazonInfo = function amazonInfo(
    url,
    description,
    username,
    title
) {
    return db.query(
        `INSERT INTO images (url, description, username, title) VALUES ($1, $2, $3, $4) RETURNING id`,
        [url, description, username, title]
    );
};

// RETRIEVE IMAGES WHEN USER CLICKS ON IMAGE
module.exports.modalInfo = function modalInfo(id) {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

// FOR ADDING COMMENTS BY USER
module.exports.insertUserComments = function insertUserComments(
    comment,
    username,
    image_id
) {
    return db.query(
        `INSERT INTO comments (comment,
        username,
        image_id) VALUES ($1, $2, $3) RETURNING comment, username, image_id, created_at, id`,
        [comment, username, image_id]
    );
};

// FOR RETRIEVING COMMENTS BY USER
module.exports.getUserComments = function getUserComments(image_id) {
    return db.query(`SELECT * FROM comments WHERE image_id = $1`, [image_id]);
};
