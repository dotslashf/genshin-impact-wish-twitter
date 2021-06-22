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

const _itemReducer = inventory => {
  const _inventory = Object.assign({});
  for (let i = 0; i < inventory.length; i++) {
    if (_inventory[inventory[i].name]) {
      _inventory[inventory[i].name].quantity++;
    } else {
      _inventory[inventory[i].name] = inventory[i];
      _inventory[inventory[i].name].quantity = 1;
    }
  }
  return _inventory;
};

const textFormatter = inventory => {
  let _inventory = _itemReducer(inventory);
  let text = [];
  let inventoryArray = [];
  Object.keys(_inventory).map(i => inventoryArray.push(_inventory[i]));
  inventoryArray.map(item => {
    const ratingEmoji = item.rating === '5' ? '🌟' : '⭐';
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
      text.push(
        `${item.rating}${ratingEmoji} ${weaponEmoji} ${item.name} x ${item.quantity}`
      );
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
      text.push(
        `${item.rating}${ratingEmoji} ${charEmoji} ${item.name} x ${item.quantity}`
      );
    }
  });
  return text.join('\n');
};

module.exports = {
  getBanner,
  textFormatter,
};
