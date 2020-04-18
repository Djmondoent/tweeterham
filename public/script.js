var Twitter = require("node-twitter-api"),
    secret = include("secret");

module.exports = function(app) {
    var twitter = new Twitter({
        consumerKey: secret.twitter.consumerKey,
    	consumerSecret: secret.twitter.consumerSecret,
    	callback: secret.twitter.callbackUrl
    });

    var _requestSecret;

    app.get("/request-token", function(req, res) {
        twitter.getRequestToken(function(err, requestToken, requestSecret) {
            if (err)
                res.status(500).send(err);
            else {
                _requestSecret = requestSecret;
                res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + requestToken);
            }
        });
    });

  
};


var Twitter = require("node-twitter-api"),
    secret = include("secret");

module.exports = function(app) {
    var twitter = new Twitter({
        consumerKey: secret.twitter.consumerKey,
    	consumerSecret: secret.twitter.consumerSecret,
    	callback: secret.twitter.callbackUrl
    });

 
   var _requestSecret;

    app.get("/access-token", function(req, res) {
        var requestToken = req.query.oauth_token,
      verifier = req.query.oauth_verifier;

        twitter.getAccessToken(requestToken, _requestSecret, verifier, function(err, accessToken, accessSecret) {
            if (err)
                res.status(500).send(err);
            else
                twitter.verifyCredentials(accessToken, accessSecret, function(err, user) {
                    if (err)
                        res.status(500).send(err);
                    else
                        res.send(user);
                });
        });
    });
};