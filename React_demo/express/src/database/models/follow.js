module.exports = (db, DataTypes) =>
    db.sequelize.define("follow", {
        author: {
            type:DataTypes.STRING(32),
            allowNull:false,
            reference:{
                model:db.user,
                key:"username"
            }
        },
        follower:{
            type:DataTypes.STRING(32),
            allowNull:false,
            reference:{
                model:db.user,
                key:"username"
            }
        },
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    }, {timestamps:false})