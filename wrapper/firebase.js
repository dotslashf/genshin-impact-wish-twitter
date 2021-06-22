const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const isAccountExist = async id => {
  const docRef = db.collection('data').doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return false;
  }
  return true;
};

const getAccount = async id => {
  try {
    const doc = await db.collection('data').doc(id).get();
    const { banner, inventory } = doc.data();
    return { ref: doc, data: { banner, inventory } };
  } catch (e) {
    console.log(e);
  }
};

const createAccount = async id => {
  try {
    const accRef = db.collection('data').doc(id);
    await accRef.set({});
  } catch (e) {
    console.log(e);
  }
};

const updateAccount = async (id, newData) => {
  const { ref, data } = await getAccount(id);
  let { inventory, banner } = data;
  const newBanner = newData.banner;
  const newInventory = newData.inventory.map(item => Object.assign({}, item));
  // console.log(typeof newData.inventory, newData.inventory);

  if (!banner && !inventory) {
    await ref.update({ banner: newBanner, inventory: newInventory });
  } else {
    // update banner
    // for (let index in banner) {
    //   console.log(banner[index]);
    //   if (banner[newBanner[index]]) {
    //     console.log('blm ada', banner[newBanner[index]]);
    //   } else {
    //     console.log('ada');
    //   }
    // }
    let bannerId = Object.keys(newBanner)[0];

    Object.keys(banner).map(item => {
      if (!banner[bannerId]) {
        console.log('blm ada');
        banner[bannerId] = newBanner[bannerId];
      } else if (bannerId === item) {
        banner[item] = newBanner[item];
      }
    });

    console.log(banner);

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
    await ref.update({ banner, inventory });
  }
};

(async () => {
  try {
    let id = 'fadhlunew';
    const account = await isAccountExist(id);

    if (!account) {
      console.log('Gak ada akun');
      await createAccount(id);
    }
    const newBanner = Object.assign({});
    newBanner['wanderlustInvocation'] = {
      attemptsCount: 25,
      pityCounter4: 9,
      pityCounter5: 56,
      guaranteed4Star: true,
      guaranteed5Star: true,
    };
    await updateAccount(id, {
      banner: newBanner,
      inventory: [],
    });
  } catch (e) {
    console.log(e);
  }
})();
