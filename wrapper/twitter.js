const Twitter = require('twit');
const { getBanner, textFormatter } = require('../helper/utils');
const { Firebase } = require('./firebase');
require('dotenv').config();

class TwitterBot {
  client = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token: process.env.TWITTER_API_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_API_ACCESS_SECRET,
  });

  postTweet = async (tweet, inventory) => {
    const tweetId = tweet.id_str;
    const text = textFormatter(inventory);
    await this.client.post('statuses/update', {
      status: text,
      auto_populate_reply_metadata: true,
      in_reply_to_status_id: tweetId,
    });
  };

  isCommandExist = tweet => {
    let text = tweet.text;
    text = text.split(' ');
    if (
      text.includes('=pullSingle_limited') ||
      text.includes('=pull_limited') ||
      text.includes('=pullSingle_standard') ||
      text.includes('=pull_standard') ||
      text.includes('=pullSingle_weapon') ||
      text.includes('=pull_weapon')
    ) {
      return true;
    } else {
      return false;
    }
  };

  tweetEvent = async tweet => {
    if (this.isCommandExist(tweet)) {
      console.log(`Pulling for ${tweet.user.screen_name}`);
      const userId = tweet.user.id_str;
      const arrTweetText = tweet.text.split(' ');
      const command = arrTweetText
        .filter(word => {
          return word[0] == '=';
        })[0]
        .split('_');
      const bannerId = command[1];
      const db = new Firebase(userId);
      const isSingleRoll = command[0] ? command[0] === 'pullSingle' : false;
      const { id, banner } = getBanner(bannerId);

      if (!(await db.isAccountExist())) {
        console.log('Create new account');
        await db.createAccount();
      }
      const { data } = await db.getAccount(userId);
      let bannerState = {};
      let inventory = [];
      if (Object.keys(data.banner).length === 0) {
        // create account
        inventory = isSingleRoll ? [banner.rollOnce()] : banner.roll();
        bannerState = Object.assign({});
        bannerState[id] = banner.getState();
        await db.updateAccount({ banner: bannerState, inventory });
      } else if (Object.keys(data.banner).length > 0) {
        if (Object.keys(data.banner).includes(id)) {
          // update existing banner
          banner.setState(data.banner[id]);
          inventory = isSingleRoll ? [banner.rollOnce()] : banner.roll();
          bannerState = Object.assign({});
          bannerState[id] = banner.getState();
          await db.updateAccount({ banner: bannerState, inventory });
        } else {
          // new banner
          inventory = isSingleRoll ? [banner.rollOnce()] : banner.roll();
          bannerState = Object.assign({});
          bannerState[id] = banner.getState();
          console.log(banner[id]);
          await db.updateAccount({ banner: bannerState, inventory });
        }
      }

      this.postTweet(tweet, inventory);
    }
  };
}

module.exports = {
  TwitterBot,
};
