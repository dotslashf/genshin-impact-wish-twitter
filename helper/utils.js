const { SparklingSteps } = require('../models/sparklingSteps');
const { WanderlustInvocation } = require('../models/wanderlustInvocation');
const { EpitomeInvocation } = require('../models/epitomeInvocation');
const sharp = require('sharp');
const { joinImages } = require('join-images');

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms * 1000));
};

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
    if (inventory[i] !== undefined) {
      if (_inventory[inventory[i].name]) {
        _inventory[inventory[i].name].quantity++;
      } else {
        _inventory[inventory[i].name] = inventory[i];
        _inventory[inventory[i].name].quantity = 1;
      }
    }
  }
  return _inventory;
};

const textFormatter = inventory => {
  let _inventory = _itemReducer(inventory);
  let text = [];
  let inventoryArray = [];
  Object.keys(_inventory).map(i => inventoryArray.push(_inventory[i]));

  inventoryArray.sort((a, b) => {
    return b.rating - a.rating;
  });
  inventoryArray.map(item => {
    const ratingEmoji = item.rating === 5 ? '🌟' : '';
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
        `${item.rating}${ratingEmoji} ${weaponEmoji} ${item.name} ${item.quantity}`
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
        `${item.rating}${ratingEmoji} ${charEmoji} ${item.name} ${item.quantity}`
      );
    }
  });
  return text.join('\n');
};

const createInventoryImg = async inventory => {
  const baseSrc = __dirname + '/../media';
  let inventorySrc = [];
  let inventoryBuffer = [];
  if (inventory.length > 1) {
    inventory.forEach(element => {
      inventorySrc.push(`${baseSrc}/${element.type}s/${element.src}`);
    });

    await Promise.all(
      inventorySrc.map(async (i, index) => {
        const _position =
          inventory[index].type === 'character'
            ? sharp.strategy.entropy
            : 'right top';
        // console.log(resizeSize);
        const buffer = await sharp(i)
          .resize(240, 335, {
            fit: sharp.fit.cover,
            position: _position,
          })
          .extend({
            top: 3,
            left: 3,
            right: 3,
            bottom: 3,
            background: '#4D91F1',
          })
          .png()
          .toBuffer();
        inventoryBuffer.push(buffer);
      })
    );

    let top = inventoryBuffer.splice(0, 5);
    let bottom = inventoryBuffer;

    const topBuffer = await new Promise(resolve => {
      joinImages(top, {
        direction: 'horizontal',
        color: { alpha: 1, b: 255, g: 255, r: 255 },
        align: 'center',
      }).then(img => {
        resolve(img.png().toBuffer());
      });
    });

    const bottomBuffer = await new Promise(resolve => {
      joinImages(bottom, {
        direction: 'horizontal',
        color: { alpha: 1, b: 255, g: 255, r: 255 },
        align: 'center',
      }).then(img => {
        resolve(img.png().toBuffer());
      });
    });

    const finalBuffer = await new Promise(resolve => {
      joinImages([topBuffer, bottomBuffer], {
        direction: 'vertical',
        color: { alpha: 1, b: 255, g: 255, r: 255 },
        align: 'center',
      }).then(img => {
        resolve(img.png().toBuffer());
      });
    });

    return finalBuffer;
  }
  // only pull one / one inventory
  else if (inventory.length === 1) {
    const _position =
      inventory[0].type === 'character' ? sharp.strategy.entropy : 'right top';

    const buffer = await sharp(
      `${baseSrc}/${inventory[0].type}s/${inventory[0].src}`
    )
      .flatten({
        background: 'white',
      })
      .resize(150, 300, {
        fit: sharp.fit.cover,
        position: _position,
      })
      .extend({
        top: 3,
        left: 3,
        right: 3,
        bottom: 3,
        background: '#4D91F1',
      })
      .png()
      .toBuffer();
    return buffer;
  }
};

module.exports = {
  getBanner,
  textFormatter,
  sleep,
  createInventoryImg,
};
