module.exports = (db, DataTypes) =>
  db.sequelize.define("profile", {
    email: {
      type: DataTypes.STRING(254),
    },
    username: {
      type: DataTypes.STRING(32),
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(40),
    },
    last_name: {
      type: DataTypes.STRING(40),
    },
    mobile: {
      type: DataTypes.STRING(12)
    },
    street: {
      type: DataTypes.STRING(100)
    },
    city: {
      type: DataTypes.STRING(100)
    },
    state: {
      type: DataTypes.STRING(3)
    },
    postcode: {
      type: DataTypes.STRING(4)
    }
  }, {
    // Don't add the timestamp attributes (updatedAt, createdAt).
    timestamps: false
  });
