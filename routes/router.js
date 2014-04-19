var express = require('express');
var passport = require('passport');
var User = require(__appbase_dirname + '/models/model-user');

var initialize = function (app) {
    setRootRoutes(app);
    setAuthRoutes(app);

    //TODO add additional router if you need
};

var setRootRoutes = function (router) {
    router.get('/', isLogined, function (req, res) {
        res.render('profile.ejs', { user: req.user });
    });

    router.get('/profile', isLogined, function (req, res) {
        res.render('profile.ejs', { user: req.user });
    });
};

var setAuthRoutes = function (router) {

    // initialize passport 
    passport.serializeUser(function (user, done) {
        console.log('Serialization: ' + user);
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        console.log('Deserialization: ' + id);
        User.findById(id, function (err, user) {
            console.log(user);
            done(err, user);
        });
    });

    require('./auth/local')(router);
    require('./auth/twitter')(router);
    require('./auth/facebook')(router);
    require('./auth/google')(router);
    //require('./auth/yahoo')(router);
    require('./auth/linkedin')(router);
    //require('./auth/github')(router);
};

var isLogined = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
};

module.exports.initialize = initialize;
