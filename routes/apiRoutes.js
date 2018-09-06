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

};
