const { TwitterBot } = require('./wrapper/twitter');
const bot = new TwitterBot();

(async () => {
  const parameters = {
    track: '@genshinwishbot',
  };
  const stream = bot.client.stream('statuses/filter', parameters);
  stream.on('connected', () => console.log('Started'));
  stream.on('tweet', tweet => {
    bot.tweetEvent(tweet);
  });
})();
