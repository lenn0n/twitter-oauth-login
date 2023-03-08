var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var port = 10000;
var cors = require('cors');
var Twitter = require('twitter-lite');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var corsOptions = {
  origin: ['https://user.oleplatform.com', 'https://sandbox.user.oleplatform.com'],
  default: "https://user.oleplatform.com"
  }
  
app.all('*', function(req, res, next) {
  const origin = corsOptions.origin.includes(req.header('origin').toLowerCase()) ? req.headers.origin : cors.default;
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/oauth/request_token",function (request, response) {
  if (!request.body.callback){
    response.send({ message: "Callback is required."})
  }
  if (!request.body.config){
    response.send({ message: "Config is required."})
  }

  const client = new Twitter(request.body.config);
  client.getRequestToken(request.body.callback)
  .then(res => {
    response.send({
      ...res,
      redirectURL: "https://api.twitter.com/oauth/authenticate?oauth_token=" + res.oauth_token
    })
  })
  .catch(err => {
    response.send({ result: false, message: "We are unable to authenticate you."})
  })
})

app.post("/oauth/access_token",function (request, response) {
  if (!request.body.oauth_verifier){
    response.send({ message: "OAuth Verifier is required."})
  }
  if (!request.body.oauth_token){
    response.send({ message: "OAuth token is required."})
  }
  if (!request.body.config){
    response.send({ message: "Config is required."})
  }

  const client = new Twitter(request.body.config);
  client.getAccessToken({
    oauth_verifier: request.body.oauth_verifier,
    oauth_token: request.body.oauth_token
  })
  .then(res => {
    const user = new Twitter({
      subdomain: "api", 
      version: "1.1",
      consumer_key: request.body.config.consumer_key,
      consumer_secret:  request.body.config.consumer_secret, 
      access_token_key: res.oauth_token, 
      access_token_secret: res.oauth_token_secret
    });
    
    user.get("account/verify_credentials", {
      include_email: true,
      skip_status: true,
      include_entities: false
    })
    .then(results => {
      response.send({ 
        email: results.email, 
        access_token: res.oauth_token,
        access_secret: res.oauth_token_secret,
        user_id: res.user_id,
        screen_name: res.screen_name
      })
    })
    .catch(err => {
      response.send({ result: false, message: "We are unable to authenticate you."})
    })
  })
  .catch(err => {
    response.send({ result: false, message: "We are unable to authenticate you."})
  })
})

app.listen(port, function () {
  console.log("Running on port: ", port)
})
