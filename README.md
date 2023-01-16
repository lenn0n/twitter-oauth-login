# twitter-oauth-login
A 3-way-legged oauth for twitter login integration.

How-To-Use:
You need to attach your twitter oauth token and secret in FormData.

/oauth/request_token
- callback
- config

/oauth/access_token
- oauth_verifier
- oauth_token
- config

Your 'config' object should be look like this:
{
  consumer_key: TWITTER_CONSUMER_KEY,
  consumer_secret: TWITTER_CONSUMER_SECRET
}

Your 'callback' should be a valid URL and added to Twitter App Config.
You will get oauth_verifier and oauth_token in your callback URL once you complete the first step.

(c) Lennon Benedict Jansuy
