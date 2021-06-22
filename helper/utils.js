const { SparklingSteps } = require('../models/sparklingSteps');
const { WanderlustInvocation } = require('../models/wanderlustInvocation');
const { EpitomeInvocation } = require('../models/epitomeInvocation');

const getBanner = banner => {
  const limitedBanner = new SparklingSteps();
  const standardBanner = new WanderlustInvocation();
  const weaponBanner = new EpitomeInvocation();

  if (banner === 'limited') {
    return {
      id: 'sparklingSteps',
      banner: limitedBanner,
    };
  } else if (banner === 'standard') {
    return {
      id: 'wanderlustInvocation',
      banner: standardBanner,
    };
  } else if (banner === 'weapon') {
    return {
      id: 'epitomeInvocation',
      banner: weaponBanner,
    };
  }
};

const textFormatter = inventory => {
  let text = [];
  inventory.map(item => {
    const rating = item.rating === '5' ? '🌟' : '⭐';
    if (item.type === 'weapon') {
      let weaponEmoji = '';
      if (item.class === 'Sword') {
        weaponEmoji = '🔪';
      } else if (item.class === 'Bow') {
        weaponEmoji = '🏹';
      } else if (item.class === 'Polearm') {
        weaponEmoji = '🔱';
      } else if (item.class === 'Claymore') {
        weaponEmoji = '🗡️';
      } else if (item.class === 'Catalyst') {
        weaponEmoji = '📖';
      }
      text.push(`${rating} ${weaponEmoji} ${item.name}`);
    }
    if (item.type === 'character') {
      let charEmoji = '';
      if (item.element === 'Hydro') {
        charEmoji = '🌊';
      } else if (item.element === 'Pyro') {
        charEmoji = '🔥';
      } else if (item.element === 'Geo') {
        charEmoji = '🗿';
      } else if (item.element === 'Cryo') {
        charEmoji = '❄️';
      } else if (item.element === 'Anemo') {
        charEmoji = '🍃';
      } else if (item.element === 'Electro') {
        charEmoji = '⚡';
      }
      text.push(`${rating} ${charEmoji} ${item.name}`);
    }
  });
  return text.join('\n');
};

module.exports = {
  getBanner,
  textFormatter,
};
