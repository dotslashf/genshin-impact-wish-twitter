const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Twitter = require('twit');

require('dotenv').config();
const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token: process.env.TWITTER_API_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_API_ACCESS_SECRET,
});

const parameters = {
  track: '@genshinwishbot',
};

const stream = client.stream('statuses/filter', parameters);

(async () => {
  let tweets = [];
  io.on('connection', _ => {
    console.log('Bot connected 🚀');
    stream.on('tweet', tweet => {
      tweets.push(tweet);
    });

    setInterval(() => {
      console.log('Total tweets to process: ', tweets.length);
      const nextTweet = tweets.shift();
      if (nextTweet) {
        io.sockets.emit('tweet', nextTweet);
      }
    }, 30000);
  });

  server.listen(3000);
})();
