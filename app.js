const fs = require('fs').promises;
const { SparklingSteps } = require('./models/sparklingSteps');

const sparklingSteps = new SparklingSteps();

const updateInventory = items => {
  // let inventory = sparklingSteps.roll();
  const obj = {
    Beidou: {
      name: 'Beidou',
      element: 'Electro',
      type: 'character',
      rating: 4,
      id: '749031334273613904',
      src: 'Beidou.png',
      percentX: 55,
      quantity: 1,
    },
    'Harbinger of Dawn': {
      name: 'Harbinger of Dawn',
      rating: 3,
      class: 'Sword',
      type: 'weapon',
      src: 'harbinger-of-dawn.png',
      quantity: 2,
    },
    'Cool Steel': {
      name: 'Cool Steel',
      rating: 3,
      class: 'Sword',
      type: 'weapon',
      src: 'cool-steel.png',
      quantity: 1,
    },
    'Ferrous Shadow': {
      name: 'Ferrous Shadow',
      rating: 3,
      class: 'Claymore',
      type: 'weapon',
      src: 'ferrous-shadow.png',
      quantity: 2,
    },
    "Sharpshooter's Oath": {
      name: "Sharpshooter's Oath",
      rating: 3,
      class: 'Bow',
      type: 'weapon',
      src: 'sharpshooters-oath.png',
      quantity: 2,
    },
    'Raven Bow': {
      name: 'Raven Bow',
      rating: 3,
      class: 'Bow',
      type: 'weapon',
      src: 'raven-bow.png',
      quantity: 1,
    },
    'Black Tassel': {
      name: 'Black Tassel',
      rating: 3,
      class: 'Polearm',
      type: 'weapon',
      src: 'black-tassel.png',
      quantity: 1,
    },
  };
  inventory = Object.assign({}, obj);
  console.log('Before', inventory.length);
  for (const item in inventory) {
    inventory[item] = Object.assign({}, inventory[item]);
  }

  for (let i = 0; i < items.length; i++) {
    if (inventory[items[i].name]) {
      inventory[items[i].name].quantity++;
    } else {
      inventory[items[i].name] = items[i];
      inventory[items[i].name].quantity = 1;
    }
  }
  console.log('After', items.length);
};

(async () => {
  const obj = await fs.readFile('./mockupData.json', 'utf-8');

  const objJson = JSON.parse(obj);
  sparklingSteps.setState(objJson);

  const inventoryNew = sparklingSteps.roll();
  console.log(inventoryNew);
  updateInventory(inventoryNew.map(item => Object.assign({}, item)));

  const banner = Object.assign({});
  banner['sparklingSteps'] = sparklingSteps.getState();
  console.log(banner);
  // const data = {
  //   banner,
  // };
  // console.log('Final data:', data);
  // sparklingSteps.roll().map(item => {
  // });

  // await fs.writeFile(
  //   './mockupData.json',
  //   JSON.stringify(sparklingSteps.getState())
  // );
  // console.log('Result', sparklingSteps.getState());
})();
