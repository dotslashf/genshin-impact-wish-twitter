const io = require('socket.io-client');
const { TwitterBot } = require('./wrapper/twitter');
const bot = new TwitterBot();

const socket = io('http://localhost:3000');
socket.on('tweet', async tweet => {
  bot.tweetEvent(tweet);
});
