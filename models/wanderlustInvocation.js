const { BaseGacha } = require('./baseGacha');
const drops = require('../data/wanderlust-invocation.json');

class WanderlustInvocation extends BaseGacha {
  constructor() {
    super(drops);
    this.name = 'Wanderlust Invocation';
    this.src = 'banners/wanderlust-invocation.png';
  }
}

module.exports = {
  WanderlustInvocation,
};
