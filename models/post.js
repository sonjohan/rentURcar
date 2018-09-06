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
      allowNull: false
      // validate: {
      //   len: [4]
      // }
    },
    price:{
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Post.associate = function(models) {
    Post.belongsTo(models.Author, {
      foreignKey: {
        name: 'firstName',
        allowNull: false
      }
    });
  };

  return Post;
};
