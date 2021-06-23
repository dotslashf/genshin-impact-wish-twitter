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

const textFormatter = (inventory, bannerName, totalSpend) => {
  let _inventory = _itemReducer(inventory);
  let text = [];
  let inventoryArray = [];
  Object.keys(_inventory).map(i => inventoryArray.push(_inventory[i]));

  inventoryArray.sort((a, b) => {
    return b.rating - a.rating;
  });
  inventoryArray.map(item => {
    const ratingEmoji = item.rating === 5 ? '🌟' : '⭐';
    let typeEmoji = '';
    if (item.type === 'weapon') {
      if (item.class === 'Sword') {
        typeEmoji = '🔪';
      } else if (item.class === 'Bow') {
        typeEmoji = '🏹';
      } else if (item.class === 'Polearm') {
        typeEmoji = '🔱';
      } else if (item.class === 'Claymore') {
        typeEmoji = '🗡️';
      } else if (item.class === 'Catalyst') {
        typeEmoji = '📖';
      }
    }
    if (item.type === 'character') {
      if (item.element === 'Hydro') {
        typeEmoji = '🌊';
      } else if (item.element === 'Pyro') {
        typeEmoji = '🔥';
      } else if (item.element === 'Geo') {
        typeEmoji = '🗿';
      } else if (item.element === 'Cryo') {
        typeEmoji = '❄️';
      } else if (item.element === 'Anemo') {
        typeEmoji = '🍃';
      } else if (item.element === 'Electro') {
        typeEmoji = '⚡';
      }
    }

    const rating = item.rating > 3 ? `${item.rating} ` : '';

    text.push(
      `${rating}${ratingEmoji}${typeEmoji} ${item.name} x ${item.quantity}`
    );
  });
  const inventoryFormatted = text.join('\n');
  const finalText = `${bannerName}:\n\n${inventoryFormatted}\n\nTotal Spend: ${totalSpend}`;
  if (finalText.length >= 280) {
    return `${bannerName}:\n\n${inventoryFormatted}`;
  }
  return finalText;
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
