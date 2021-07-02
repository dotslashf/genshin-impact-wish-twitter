const Twitter = require('twit');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
require('dotenv').config();

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

bot = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token: process.env.TWITTER_API_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_API_ACCESS_SECRET,
});

getUser = async id => {
  const user = await bot.get('users/show', { user_id: id });
  return user.data;
};

(async () => {
  const listData = [];
  const dataRef = db.collection('data');
  const snapshot = await dataRef.get();
  snapshot.forEach(doc => {
    const obj = Object.assign({});
    // console.log(doc.data()['inventory']);
    let { inventory } = doc.data();
    let wishes = Object.keys(inventory).reduce((acc, item) => {
      return acc + inventory[item].quantity;
    }, 0);
    obj[doc.id] = { id: doc.id, wishes };
    listData.push(obj[doc.id]);
  });
  listData.sort((a, b) => {
    return b.wishes - a.wishes;
  });

  let spenderFormatted = [];

  const topSpender = listData.splice(0, 5);
  await Promise.all(
    topSpender.map(async (data, i) => {
      const user = await getUser(data.id);
      let emoji = '';
      if (i === 0) {
        emoji = '🥇';
      } else if (i === 1) {
        emoji = '🥈';
      } else if (i === 2) {
        emoji = '🥉';
      } else {
        emoji = '🏅';
      }
      spenderFormatted.push({
        text: `${emoji} @${user.screen_name} with ${data.wishes} wishes ($${(
          0.0129 *
          160 *
          data.wishes
        ).toFixed(2)})`,
        wishes: data.wishes,
      });
    })
  );

  let finalSpender = ``;
  spenderFormatted.sort((a, b) => {
    return b.wishes - a.wishes;
  });
  spenderFormatted.map(s => {
    finalSpender += `${s.text}\n`;
  });
  const tweetText = `Users with most pull 👏\n\n${finalSpender}\n\n🌟 Generated on: ${new Date().toLocaleString()}`;

  await bot.post('statuses/update', {
    status: tweetText,
    auto_populate_reply_metadata: true,
  });
})();
