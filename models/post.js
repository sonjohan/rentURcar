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
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Post.belongsTo(models.Author, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Post;
};
