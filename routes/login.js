var express = require('express');
var router = express.Router();

var config = require('../config');
var mysql = require('../databases/vb-mysql');
var vbauth = require('../middlewares/vbauth')(mysql, config.vbauth);

// Tries to authenticate the user
router.use(vbauth.session);

// Show login page...
router.get('/login', function(req, res, next) {
  var vbuser = (req.vbuser.userid > 0 ? req.vbuser : null);

  res.render('login', {
    title: 'WindBot Chat Login',
    vbuser: vbuser
  });
});

// Performs login
router.post('/login', function(req, res, next) {
  var renderPage = function(res, status, vbuser) {
    res.render('login', {
      title: 'WindBot Chat Login',
      loginStatus: status,
      vbuser: vbuser
    });
  };
  if (req.vbuser.userid > 0) {
    return renderPage(res, 'You are already logged in', req.vbuser);
  }

  var username = req.body.user;
  var pass = req.body.pass;
  var rememberme = (req.body.remember === 'on');

  vbauth.login(username, pass, rememberme, req, res, function(err, ret) {
    if (err) return next(err);

    var vbuser = (req.vbuser.userid > 0 ? req.vbuser : null);
    renderPage(res, ret, vbuser);
  });
});

// Logs you out
router.use('/logout', function(req, res, next) {
  vbauth.logout(req, res, function(err, ret) {
    if (err) return next(err);

    res.redirect('/login');
  });
});

module.exports = router;