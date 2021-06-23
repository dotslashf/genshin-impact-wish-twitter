const Twitter = require('twit');
const {
  getBanner,
  textFormatter,
  createInventoryImg,
} = require('../helper/utils');
const { Firebase } = require('./firebase');
const fs = require('fs').promises;
require('dotenv').config();

class TwitterBot {
  client = new Twitter({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token: process.env.TWITTER_API_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_API_ACCESS_SECRET,
  });

  postTweet = async (tweet, dataToTweet) => {
    const tweetId = tweet.id_str;
    const media = await this.uploadMedia('', dataToTweet.inventory);
    const text = textFormatter(
      dataToTweet.inventory,
      dataToTweet.bannerName,
      dataToTweet.totalSpend
    );
    await this.client.post('statuses/update', {
      status: text,
      auto_populate_reply_metadata: true,
      in_reply_to_status_id: tweetId,
      media_ids: [media.media_id_string],
    });
  };

  uploadMedia = async (path, inventory) => {
    const buffer = await createInventoryImg(inventory);
    await fs.writeFile('./media/upload.png', buffer);
    const imageData = await fs.readFile(`./media/upload.png`, {
      encoding: 'base64',
    });

    const upload = () => {
      return new Promise(resolve => {
        this.client.post(
          'media/upload',
          {
            media_data: imageData,
          },
          (err, data, res) => {
            if (!err) {
              resolve(data);
            }
          }
        );
      });
    };

    const data = await upload();
    return data;
  };

  isCommandExist = tweet => {
    let text = tweet.text;
    text = text.split(' ');
    if (
      text.includes('=pullOne_limited') ||
      text.includes('=pull_limited') ||
      text.includes('=pullOne_standard') ||
      text.includes('=pull_standard') ||
      text.includes('=pullOne_weapon') ||
      text.includes('=pull_weapon')
    ) {
      return true;
    } else {
      return false;
    }
  };

  tweetEvent = async tweet => {
    if (this.isCommandExist(tweet)) {
      const userId = tweet.user.id_str;
      const arrTweetText = tweet.text.split(' ');
      let totalSpend = '';
      const command = arrTweetText
        .filter(word => {
          return word[0] == '=';
        })[0]
        .split('_');
      const bannerId = command[1];
      const db = new Firebase(userId);
      const isSingleRoll = command[0] ? command[0] === '=pullOne' : false;
      const { id, banner } = getBanner(bannerId);

      console.log(
        `Pulling ${command[0] === '=pull' ? 10 : 1} ${banner.name} for ${
          tweet.user.screen_name
        }`
      );

      if (!(await db.isAccountExist())) {
        // create new account
        await db.createAccount();
      }
      const { data } = await db.getAccount(userId);
      let bannerState = {};
      let inventory = [];
      if (Object.keys(data.banner).length === 0) {
        inventory = isSingleRoll ? [banner.rollOnce()] : banner.roll();
        bannerState = Object.assign({});
        bannerState[id] = banner.getState();
        totalSpend = await db.updateAccount({ banner: bannerState, inventory });
      } else if (Object.keys(data.banner).length > 0) {
        if (Object.keys(data.banner).includes(id)) {
          // update existing banner
          banner.setState(data.banner[id]);
          inventory = isSingleRoll ? [banner.rollOnce()] : banner.roll();
          bannerState = Object.assign({});
          bannerState[id] = banner.getState();
          totalSpend = await db.updateAccount({
            banner: bannerState,
            inventory,
          });
        } else {
          // new banner
          inventory = isSingleRoll ? [banner.rollOnce()] : banner.roll();
          bannerState = Object.assign({});
          bannerState[id] = banner.getState();
          totalSpend = await db.updateAccount({
            banner: bannerState,
            inventory,
          });
        }
      }

      const dataToTweet = {
        inventory,
        totalSpend,
        bannerName: banner.name,
      };

      this.postTweet(tweet, dataToTweet);
    }
  };
}

module.exports = {
  TwitterBot,
};
