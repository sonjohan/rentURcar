module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define("Post", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model:{
      type: DataTypes.STRING,
      allowNull: false
    },
    year:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [4]
      }
    },
    price:{
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    image:{
      type: DataTypes.BLOB,
      allowNull: false
    }
  });

  Post.associate = function(models) {
    Post.belongsTo(models.Author, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Post;
};
