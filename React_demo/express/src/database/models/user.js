module.exports = (db, DataTypes) =>
    db.sequelize.define("user", {
        username: {
            type: DataTypes.STRING(32),
            primaryKey: true
        },
        password_hash: {
            type: DataTypes.STRING(96),
            allowNull: false
        },
        blocked: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        login_time: {
            type: DataTypes.DATE
        },
        logout_time: {
            type: DataTypes.DATE
        }
    }, {
        timestamps: false
    });