module.exports = (db, DataTypes) =>
    db.sequelize.define("like", {
        id:{
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        username: {
            type:DataTypes.STRING(32),
            allowNull:false,
            reference:{
                model:db.user,
                key:"username"
            }
        },
        post_id: {
          type: DataTypes.INTEGER,
          allowNull:false,
          reference:{
            model:db.post,
            key:"post_id"
          }
        },
        type:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }

    }, {timestamps:false})