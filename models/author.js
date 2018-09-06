module.exports = function(sequelize, DataTypes) {
  var Author = sequelize.define("Author", {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  });

  Author.associate = function(models) {
    Author.hasMany(models.Post, {
      onDelete: "cascade"
    });
  };

  return Author;
};
