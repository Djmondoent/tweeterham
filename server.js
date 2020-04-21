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

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys: [process.env.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());


  
app.get("/", (req, res) => {
  // console.log(req.user);

  if(req.user){
    if(req.cookies['usertype'] == 'pub'){
      res.render('publisherusers');
    }else if(req.cookies['usertype'] == 'adv'){
      res.render('advertiserusers');
    }
    }else{
    res.render('index');
  }

});


// App start listning on port ......
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});


// mongoDB connection 
mongoose.connect('mongodb+srv://test:uwyftBn7dR1HBEWO@cluster0-rudmp.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology: true, useFindAndModify: false } );

//mongoDB error and connection success handler 
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
          //found user already in the database
          // console.log('user has been found:',currentUser);
          done(null, currentUser);
        }else {
          // create a new user
          new User({
            username:profile.username,
            twitterid:profile.id,
            displayName:profile.displayName,
            // profileImage:profile.rofile_image_url,
            advaccount:'false',
            pubaccount:'false'
          }).save().then(newUser => {
            // console.log('new user has been created:', newUser);
            done(null, newUser);
          });
        }
      });

    

    }
  )
);

// User serialization
passport.serializeUser((user, done) => {
  // console.log('user has been serialized:',user.id);
  done(null, user.id);
});

// User deserialization
passport.deserializeUser((id, done) => {
  // console.log('user id:',id);
  User.findById(id).then(user => {
    // console.log('user has been deserialized:',user);
    done(null, user);
  });
});


// first loging handler
app.get("/twitter",(req,res,next) => {
  res.cookie('usertype', req.query.user, {
    httpOnly: true, 
    secure: false ,
    maxAge: 24*60*60*1000
});
  // console.log(req);
  next();
} ,passport.authenticate("twitter"));


// TWitter call back
app.get("/twitter/return",
  passport.authenticate("twitter", { failureRedirect: "/login" }),
  (req, res) => {
    // console.log(req.user);
    if(req.cookies['usertype'] == 'pub'){
      User.findOneAndUpdate({_id: req.user.id}, {pubaccount: true}).then(user =>{
        res.render('publisherusers');
      });
      
    }else if(req.cookies['usertype'] == 'adv'){
      User.findOneAndUpdate({_id: req.user.id}, {advaccount: true}).then(user =>{
        res.render('advertiserusers');
      });
      
    }
  }
);
