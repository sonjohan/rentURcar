var db = require("../models");
var passport = require("../helpers/passport.js");


module.exports = function(app) {

app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json("/members");
})

app.post("/api/signup", (req, res) => {
  db.User.create({
      email: req.body.email,
      password: req.body.password
  }).then(() => {
      res.redirect(307, "/api/login");
  }).catch(function (err) {
      console.log(err);
      res.json(err);
  });
});

app.get("/api/userData", (req, res) => {
  if (!req.user) {
      res.json({ "message": "unauth acess" });
  }
  else {
      res.json({
          email: req.user.email,
          id: req.user.id
      });
  }
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});


  app.get("/api/authors", function(req, res) {
    // Here we add an "include" property to our options in our findAll query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.Author.findAll({
      include: [db.Post]
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });

  app.get("/api/authors/:id", function(req, res) {
    // Here we add an "include" property to our options in our findOne query
    // We set the value to an array of the models we want to include in a left outer join
    // In this case, just db.Post
    db.Author.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Post]
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });

  app.post("/api/authors", function(req, res) {
    db.Author.create(req.body).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });

  app.delete("/api/authors/:id", function(req, res) {
    db.Author.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });

};
