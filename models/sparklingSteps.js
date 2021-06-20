const { BaseGacha } = require('./baseGacha');
const drops = require('../data/sparkling-steps-2.json');

class SparklingSteps extends BaseGacha {
  constructor() {
    super(drops);
  }
}

module.exports = {
  SparklingSteps,
};
