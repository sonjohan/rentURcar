
var path = require("path");

var isAuthenticated = require('../helpers/isAuthenticated');

module.exports = function (app) {

    app.get("/", (req, res) => {
        if (req.user) {
            res.redirect('members')
        };
        res.sendFile(path.join(__dirname, "../public/signup.html"));
    });

    app.get("/login", (req, res) => {
        if (req.user) {
            res.redirect('members')
        };
        res.sendFile(path.join(__dirname, "../public/login.html"));
    });

    app.get("/cms", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/cms.html"));
      });

    app.get("/members", isAuthenticated, (req, res) => {
        res.sendFile(path.join(__dirname, "../public/members.html"));
    });


}