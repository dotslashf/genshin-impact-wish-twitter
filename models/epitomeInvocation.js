const { BaseGacha } = require('./baseGacha');
const drops = require('../data/epitome-invocation.json');

class EpitomeInvocation extends BaseGacha {
  constructor() {
    super(drops);
    this.name = 'Epitome Invocation';
    this.src = 'banners/epitome-invocation.png';
  }
}

module.exports = {
  EpitomeInvocation,
};
