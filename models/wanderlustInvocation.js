const { BaseGacha } = require('./baseGacha');
const drops = require('../data/wanderlust-invocation.json');

class WanderlustInvocation extends BaseGacha {
  constructor() {
    super(drops);
  }
}

module.exports = {
  WanderlustInvocation,
};
