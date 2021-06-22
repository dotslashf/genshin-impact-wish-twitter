const { BaseGacha } = require('./baseGacha');
const drops = require('../data/epitome-invocation.json');

class EpitomeInvocation extends BaseGacha {
  constructor() {
    super(drops);
  }
}

module.exports = {
  EpitomeInvocation,
};
