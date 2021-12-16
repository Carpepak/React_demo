const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
    Op: Sequelize.Op
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.DIALECT
});

// Include models.
db.user = require("./models/user.js")(db, DataTypes);
db.post = require("./models/post.js")(db, DataTypes);
db.follow = require("./models/follow.js")(db, DataTypes);
db.like = require("./models/like.js")(db, DataTypes);
db.time = require("./models/time.js")(db, DataTypes);
db.profile = require("./models/profile.js")(db, DataTypes);

db.sync = async() => {
    await db.sequelize.sync();
};

module.exports = db;