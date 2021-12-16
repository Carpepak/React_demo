module.exports = (db, DataTypes) => 
  db.sequelize.define("time", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      date: { 
          type: DataTypes.STRING,
          allowNull: false
      },
      username: {
          type: DataTypes.STRING(32),
          allowNull: false
      },
      time: {
          type: DataTypes.INTEGER,
          allowNull: false
      }

  }, { timestamp: false });
         