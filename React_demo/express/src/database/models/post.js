module.exports = (db, DataTypes) =>
    db.sequelize.define("post", {
        post_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(32),
            allowNull: false,
            reference:{
                model: db.user,
                key: "username"
            }
        },
        text: {
            type: DataTypes.STRING(600),
            allowNull: false
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        reply: {
            type: DataTypes.INTEGER,
            allowNull: false,
            reference:{
                model: db.post,
                key: "post_id"
            }
        },
        likes: {
            type: DataTypes.INTEGER,
        },
        dislikes: {
            type: DataTypes.INTEGER,
        },
        imgUrl: {
            type: DataTypes.STRING(128)
        }
    }, {
        // Don't add the timestamp attributes (updatedAt, createdAt).
        timestamps: false
    });