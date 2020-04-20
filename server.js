const express = require("express");
var passport = require("passport");
var TwitterStrategy = require("passport-twitter").Strategy;
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
const User = require('./mongomodels/user');
const cookieSession = require('cookie-session');


const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys: [process.env.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());


  
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});



const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});



mongoose.connect('mongodb+srv://test:uwyftBn7dR1HBEWO@cluster0-rudmp.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true } );

mongoose.connection.once('open', function() {
    console.log('mongodb connection has been made!');
}).on('error', err => {
    console.log('monogdb connection err:', err);
});




passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.consumerKey,
      consumerSecret: process.env.consumerSecret,
      callbackURL: process.env.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      
      User.findOne({twitterid: profile.id}).then((currentUser) => {
        if(currentUser){
          //found user
          // console.log('user has been found:',currentUser);
          done(null, currentUser);
        }else {
          // create a new user
          new User({
            username:profile.username,
            twitterid:profile.id,
            displayName:profile.displayName
            // profileImage:profile.rofile_image_url
          }).save().then(newUser => {
            // console.log('new user has been created:', newUser);
            done(null, newUser);
          });
        }
      });

    

    }
  )
);

passport.serializeUser((user, done) => {
  // console.log('user has been serialized:',user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // console.log('user id:',id);
  User.findById(id).then(user => {
    // console.log('user has been deserialized:',user);
    done(null, user);
  });
});



app.get("/twitter",(req,res,next) => {
  res.cookie('usertype', req.query.user, {
    httpOnly: true, 
    secure: true 
});
  // console.log(req.user);
  next();
} ,passport.authenticate("twitter"));


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

 
