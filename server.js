const express = require("express");
var mysql = require('mysql');
var session = require("express-session");
var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;
var cookieParser = require('cookie-parser');
var mongodb = require('mongodb');

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(session({ secret: "whatever", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser()) 



//static web site 

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});



const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});







passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.consumerKey,
      consumerSecret: process.env.consumerSecret,
      callbackURL: process.env.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      return done(null, profile);
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});



app.get("/twitter",(req,res,next) => {
  res.cookie('usertype', req.query.user, {
    httpOnly: true, // http only, prevents JavaScript cookie access
    secure: true // cookie must be sent over https / ssl
});
  
  next();
} ,passport.authenticate("twitter"));


// app.get("/twitter", passport.authenticate("twitter"));

app.get("/twitter/return",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  (req, res) => {
    if(req.cookies['usertype'] == 'pub'){
      res.sendFile(__dirname + "/views/publisherusers.html");
    }else if(req.cookies['usertype'] == 'adv'){
      res.sendFile(__dirname + "/views/advertiserusers.html");
      
      
      
      
      
      
    }
  }
);

///
// app.get('/twitter/return',passport.authenticate('twitter',{ failureRedirect: '/login' }), (req,res) => {
//   res.json(req.headers);
// });

/// <h1>Publishers users
//</h1>
//  <h2> <a href="https://tweeterham.glitch.me/views/tweeterhamlogin.html" class="twitter-login-button" </a>
//<img alt="Sign in with Twitter" src="http://Developer.twitter.com/content/dam/developer-twitter/images/sign-in-with-twitter-gray.png" >
// </h2>
//<body>

//
//<h1>Advertiser users </h1>
//<h3>

//<a href=" "  class="twitter-login-button" >
//    <img alt="sign in with Twitter" src="http://Developer.twitter.com/content/dam/developer-twitter/images/sign-in-with-twitter-gray.png">
// </a>
// </h3>
