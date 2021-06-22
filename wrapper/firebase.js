const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

class Firebase {
  constructor(id) {
    this.id = id;
  }

  isAccountExist = async () => {
    const docRef = db.collection('data').doc(this.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return false;
    }
    return true;
  };

  getAccount = async () => {
    try {
      const docRef = db.collection('data').doc(this.id);
      const doc = await docRef.get();
      return { ref: docRef, data: doc.data() };
    } catch (e) {
      console.log(e);
    }
  };

  createAccount = async () => {
    try {
      const accRef = db.collection('data').doc(this.id);
      await accRef.set({ banner: {}, inventory: {} });
    } catch (e) {
      console.log(e);
    }
  };

  updateAccount = async newData => {
    const { ref, data } = await this.getAccount(this.id);
    let { inventory, banner } = data;
    const _inventory = data.inventory;
    const _banner = data.banner;
    const newBanner = newData.banner;
    const newInventory = newData.inventory.map(item => Object.assign({}, item));

    const bannerId = Object.keys(newBanner)[0];

    // update & sanitize banner
    Object.keys(banner).map(item => {
      if (!banner[bannerId]) {
        banner[bannerId] = newBanner[bannerId];
      } else if (bannerId === item) {
        banner[item] = newBanner[item];
      }
    });

    // update & sanitize inventory
    inventory = Object.assign({}, inventory);
    for (const item in inventory) {
      inventory[item] = Object.assign({}, inventory[item]);
    }
    for (let i = 0; i < newInventory.length; i++) {
      if (inventory[newInventory[i].name]) {
        inventory[newInventory[i].name].quantity++;
      } else {
        inventory[newInventory[i].name] = newInventory[i];
        inventory[newInventory[i].name].quantity = 1;
      }
    }

    if (
      Object.keys(_inventory).length === 0 &&
      Object.keys(_banner).length === 0
    ) {
      await ref.set({ banner: newBanner, inventory });
    } else {
      await ref.update({ banner, inventory });
    }
  };
}

module.exports = {
  Firebase,
};
