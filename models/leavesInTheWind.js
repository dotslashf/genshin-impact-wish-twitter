const { BaseGacha } = require('./baseGacha');
const drops = require('../data/leaves-in-the-wind.json');

class LeavesInTheWind extends BaseGacha {
  constructor() {
    super(drops);
    this.name = 'Leaves in the Wind';
    this.src = 'banners/leaves-in-the-wind.png';
  }
}

module.exports = {
  LeavesInTheWind,
};
